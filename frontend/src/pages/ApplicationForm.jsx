import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const BRANCHES = [
  { value: "CSE", label: "CSE (Computer Science and Engineering)" },
  { value: "CE A", label: "CE A (Computer Engineering A)" },
  { value: "CE B", label: "CE B (Computer Engineering B)" },
  { value: "CE C", label: "CE C (Computer Engineering C)" },
  { value: "ECS", label: "ECS (Electronics and Computer Science)" },
  { value: "MECH", label: "MECH (Mechanical Engineering)" },
];

const ROLES = [
  {
    id: 1,
    name: "Jr. Technical Head",
    description: "Lead technical projects and development",
  },
  {
    id: 2,
    name: "Jr. Design Head",
    description: "Lead design projects and development",
  },
  {
    id: 3,
    name: "Jr. Event Head",
    description: "Lead event planning and execution",
  },
  {
    id: 4,
    name: "Jr. Web Master",
    description: "Maintain and develop web platforms",
  },
  {
    id: 5,
    name: "Jr. Public Relation Head",
    description: "Manage public relations and community engagement",
  }
];

const QUESTIONS = [
  {
    id: 1,
    question:
      "Why do you want to join CodeStorm and what unique value would you bring to our community?",
    wordLimit: 150,
  },
  {
    id: 2,
    question:
      "List your work experience, extra-curriculars, or participations (if any).",
    wordLimit: 300,
  },
  {
    id: 3,
    question:
      "How do you see yourself contributing to CodeStorm's mission of changing the interview game in tech?",
    wordLimit: 150,
  },
];

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    mobile: "",
    selectedRoles: [],
    answers: { 1: "", 2: "", 3: "" },
    skills: "",
    resumeUrl: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Check authentication and existing submission
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || "",
          email: user.email || "",
        }));

        // Check if user has already submitted
        const docRef = doc(db, "applications", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHasSubmitted(true);
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  // Upload resume to Cloudinary
  const uploadResume = async (file) => {
    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("resource_type", "auto");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, resumeUrl: data.secure_url }));
        toast.success("Resume uploaded successfully!");
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error("Failed to upload resume. Please try again.");
      setErrors((prev) => ({
        ...prev,
        resume: "Failed to upload resume. Please try again.",
      }));
    } finally {
      setResumeUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be less than 5MB",
        }));
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, DOC, and DOCX files are allowed");
        setErrors((prev) => ({
          ...prev,
          resume: "Only PDF, DOC, and DOCX files are allowed",
        }));
        return;
      }

      setResumeFile(file);
      setErrors((prev) => ({ ...prev, resume: "" }));
      uploadResume(file);
    }
  };

  const toggleRole = (roleId) => {
    setFormData((prev) => {
      const selected = prev.selectedRoles;
      if (selected.includes(roleId)) {
        return {
          ...prev,
          selectedRoles: selected.filter((id) => id !== roleId),
        };
      } else if (selected.length < 3) {
        return { ...prev, selectedRoles: [...selected, roleId] };
      } else {
        toast.warning("You can select up to 3 roles only");
      }
      return prev;
    });
  };

  const handleAnswerChange = (questionId, value) => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const question = QUESTIONS.find((q) => q.id === questionId);

    if (words.length <= question.wordLimit) {
      setFormData((prev) => ({
        ...prev,
        answers: { ...prev.answers, [questionId]: value },
      }));
      setErrors((prev) => ({ ...prev, [`answer${questionId}`]: "" }));
    } else {
      toast.warning(
        `Question ${questionId} exceeds ${question.wordLimit} word limit`
      );
    }
  };

  const handleSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const missingFields = [];

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      missingFields.push("Mobile number");
    } else {
      // Remove all spaces and check if it matches +91 followed by 10 digits
      const cleanedMobile = formData.mobile.replace(/\s+/g, "");
      const mobilePattern = /^\+91\d{10}$/;

      if (!mobilePattern.test(cleanedMobile)) {
        newErrors.mobile =
          "Mobile number must be in format +91 followed by 10 digits";
        missingFields.push("Valid mobile number (+91 followed by 10 digits)");
        toast.error(
          "Please enter a valid mobile number in format: +91 followed by 10 digits"
        );
      }
    }

    if (!formData.branch) {
      newErrors.branch = "Please select your branch";
      missingFields.push("Branch");
    }

    if (formData.selectedRoles.length === 0) {
      newErrors.roles = "Please select at least one role";
      missingFields.push("Role selection");
    }

    QUESTIONS.forEach((q) => {
      if (!formData.answers[q.id].trim()) {
        newErrors[`answer${q.id}`] = "This answer is required";
        missingFields.push(`Answer to question ${q.id}`);
      }
    });

    if (!formData.skills.trim()) {
      newErrors.skills = "Please enter at least one skill";
      missingFields.push("Skills");
    }

    setErrors(newErrors);

    // Show specific toast messages for missing fields (excluding mobile if already shown)
    const fieldsToShow = missingFields.filter(
      (field) => !field.includes("Valid mobile number")
    );
    if (fieldsToShow.length > 0) {
      if (fieldsToShow.length === 1) {
        toast.error(`Please complete: ${fieldsToShow[0]}`);
      } else if (fieldsToShow.length <= 3) {
        toast.error(`Please complete: ${fieldsToShow.join(", ")}`);
      } else {
        toast.error(`Please complete ${fieldsToShow.length} missing fields`);
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  // Add a function to format mobile number as user types
  const handleMobileChange = (e) => {
    let value = e.target.value;

    // If user starts typing without +91, add it
    if (value && !value.startsWith("+91")) {
      // Remove any existing +91 and spaces, then add +91
      value = "+91 " + value.replace(/^\+91\s*/, "").replace(/\s+/g, "");
    }

    // Limit to +91 + 10 digits (with spaces)
    const cleanedValue = value.replace(/\s+/g, "");
    if (cleanedValue.length > 13) {
      // +91 (3) + 10 digits = 13 characters
      return;
    }

    setFormData((prev) => ({ ...prev, mobile: value }));

    // Clear mobile error when user starts typing correctly
    if (errors.mobile) {
      const cleanedMobile = value.replace(/\s+/g, "");
      const mobilePattern = /^\+91\d{10}$/;
      if (mobilePattern.test(cleanedMobile)) {
        setErrors((prev) => ({ ...prev, mobile: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    toast.loading("Submitting your application...", { id: "submit" });

    try {
      const applicationData = {
        ...formData,
        userId: user.uid,
        submittedAt: serverTimestamp(),
        status: "pending",
      };

      await setDoc(doc(db, "applications", user.uid), applicationData);
      toast.success("Application submitted successfully!", { id: "submit" });
      setHasSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.", {
        id: "submit",
      });
      setErrors({ submit: "Failed to submit application. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const getWordCount = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Application Submitted!
          </h2>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to CodeStorm. We'll review your application
            and get back to you soon.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Join CodeStorm
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Branch *
                </label>
                <Select
                  value={formData.branch}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, branch: value }))
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.branch ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.branch}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mobile Number *
                </label>
                <Input
                  type="tel"
                  placeholder="+91 69696 96969"
                  value={formData.mobile}
                  onChange={handleMobileChange}
                  className={errors.mobile ? "border-destructive" : ""}
                />
                {errors.mobile && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.mobile}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Role Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Role Preferences (Select up to 3)
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Choose roles in order of your preference. You can select up to 3
              positions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLES.map((role) => (
                <motion.div
                  key={role.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.selectedRoles.includes(role.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleRole(role.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{role.name}</h3>
                    {formData.selectedRoles.includes(role.id) && (
                      <Badge variant="default" className="text-xs">
                        #{formData.selectedRoles.indexOf(role.id) + 1}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </motion.div>
              ))}
            </div>
            {errors.roles && (
              <p className="text-destructive text-sm mt-2">{errors.roles}</p>
            )}
          </Card>

          {/* Questions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Application Questions
            </h2>
            <div className="space-y-6">
              {QUESTIONS.map((question, index) => (
                <div key={question.id}>
                  <label className="block text-sm font-medium mb-2">
                    {index + 1}. {question.question} *
                  </label>
                  <Textarea
                    rows={4}
                    value={formData.answers[question.id]}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    className={
                      errors[`answer${question.id}`] ? "border-destructive" : ""
                    }
                    placeholder="Type your answer here..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors[`answer${question.id}`] ? (
                      <p className="text-destructive text-sm">
                        {errors[`answer${question.id}`]}
                      </p>
                    ) : (
                      <div />
                    )}
                    <p
                      className={`text-xs ${
                        getWordCount(formData.answers[question.id]) >
                        question.wordLimit
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {getWordCount(formData.answers[question.id])}/
                      {question.wordLimit} words
                    </p>
                  </div>
                </div>
              ))}
              {/* Skills input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Skills (comma separated) *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. React, Python, Figma, Public Speaking"
                  value={formData.skills}
                  onChange={handleSkillsChange}
                  className={errors.skills ? "border-destructive" : ""}
                />
                {errors.skills && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.skills}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Resume Upload */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Resume Upload (Optional)
            </h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {formData.resumeUrl ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="text-white">Resume uploaded successfully!</p>
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(formData.resumeUrl, "_blank")}
                    >
                      View Resume
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, resumeUrl: "" }));
                        setResumeFile(null);
                        toast.success("Resume removed");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-white mb-2">Upload your resume</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, or DOCX files up to 5MB
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                      disabled={resumeUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("resume-upload").click()
                      }
                      disabled={resumeUploading}
                    >
                      {resumeUploading ? "Uploading..." : "Choose File"}
                    </Button>
                  </div>
                </div>
              )}
              {errors.resume && (
                <p className="text-destructive text-sm mt-2">{errors.resume}</p>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full md:w-auto min-w-[200px]"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>

          {errors.submit && (
            <p className="text-destructive text-sm text-center">
              {errors.submit}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
