import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PhoneCardStack from "./PhoneCardStack";
import MediaItem from "./MediaItem";

const GalleryModal = ({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

  // lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Main Modal */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4"
      >
        <div className="relative w-full max-w-5xl h-[90vh] sm:h-[85vh] md:h-[80vh] rounded-2xl border border-border/60 bg-card/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* top sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          {/* ambient glow inside modal */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

          <div className="h-full flex flex-col">
            <div className="flex-1 p-3 sm:p-4 md:p-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedItem.id}
                  className="relative w-full h-full flex items-center justify-center"
                  initial={{ y: 24, scale: 0.96, opacity: 0 }}
                  animate={{
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 0.5,
                    },
                  }}
                  exit={{
                    y: 24,
                    scale: 0.96,
                    opacity: 0,
                    transition: { duration: 0.15 },
                  }}
                >
                  <div className="relative max-h-full max-w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <MediaItem
                      item={selectedItem}
                      className="max-h-[70vh] w-auto max-w-full object-contain bg-black/40"
                      onClick={() => {}}
                    />
                    {/* caption overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
                      <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold tracking-tight">
                        {selectedItem.title}
                      </h3>
                      <p className="text-white/75 text-xs sm:text-sm mt-1 max-w-2xl">
                        {selectedItem.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Close Button */}
          <motion.button
            aria-label="Close gallery"
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/70 text-foreground border border-border/60 hover:bg-background/90 backdrop-blur-sm"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Draggable Dock */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }));
        }}
        className="fixed z-50 left-1/2 bottom-4 -translate-x-1/2 touch-none"
      >
        <motion.div className="relative rounded-2xl bg-card/70 backdrop-blur-2xl border border-border/60 shadow-2xl cursor-grab active:cursor-grabbing">
          {/* sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-t-2xl" />
          <div className="flex items-center -space-x-2 px-3 py-2">
            {mediaItems.map((item, index) => {
              const active = selectedItem.id === item.id;
              return (
                <motion.div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  style={{
                    zIndex: active ? 30 : mediaItems.length - index,
                  }}
                  className={`
                    relative group
                    w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0
                    rounded-lg overflow-hidden
                    cursor-pointer hover:z-20
                    ${
                      active
                        ? "ring-2 ring-primary shadow-lg shadow-primary/30"
                        : "ring-1 ring-white/10 hover:ring-white/40"
                    }
                  `}
                  initial={{ rotate: index % 2 === 0 ? -12 : 12 }}
                  animate={{
                    scale: active ? 1.2 : 1,
                    rotate: active ? 0 : index % 2 === 0 ? -12 : 12,
                    y: active ? -8 : 0,
                  }}
                  whileHover={{
                    scale: 1.3,
                    rotate: 0,
                    y: -10,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                >
                  <MediaItem
                    item={item}
                    className="w-full h-full"
                    onClick={() => setSelectedItem(item)}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/25" />
                  {active && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute -inset-2 bg-primary/25 blur-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

const InteractiveBentoGallery = ({
  mediaItems,
  title,
  description,
  onGalleryModalToggle,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const check = () => setIsPhone(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Notify parent when modal opens/closes
  useEffect(() => {
    if (typeof onGalleryModalToggle === "function") {
      onGalleryModalToggle(!!selectedItem);
    } else {
      window.dispatchEvent(
        new CustomEvent("gallery-modal-toggle", { detail: !!selectedItem })
      );
    }
  }, [selectedItem, onGalleryModalToggle]);

  if (isPhone) {
    return (
      <PhoneCardStack
        mediaItems={mediaItems}
        title={title}
        description={description}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mb-10">
      {/* Ambient glow behind grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="mb-8 text-center">
        {title && (
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
        )}
        {description && (
          <motion.p
            className="mt-2 text-sm sm:text-base text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {description}
          </motion.p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen={true}
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[200px] sm:auto-rows-[60px]"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                className={`group relative overflow-hidden rounded-2xl cursor-move ${item.span} flex ring-1 ring-border/60 hover:ring-primary/50 transition-all duration-300`}
                onClick={() => !isDragging && setSelectedItem(item)}
                variants={{
                  hidden: { y: 50, scale: 0.9, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.05,
                    },
                  },
                }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, info) => {
                  setIsDragging(false);
                  if (window.innerWidth < 640) {
                    const moveDistance = info.offset.y;
                    if (Math.abs(moveDistance) > 50) {
                      const newItems = [...items];
                      const draggedItem = newItems[index];
                      const targetIndex =
                        moveDistance > 0
                          ? Math.min(index + 1, items.length - 1)
                          : Math.max(index - 1, 0);
                      newItems.splice(index, 1);
                      newItems.splice(targetIndex, 0, draggedItem);
                      setItems(newItems);
                    }
                  } else {
                    const moveDistance = info.offset.x + info.offset.y;
                    if (Math.abs(moveDistance) > 50) {
                      const newItems = [...items];
                      const draggedItem = newItems[index];
                      const targetIndex =
                        moveDistance > 0
                          ? Math.min(index + 1, items.length - 1)
                          : Math.max(index - 1, 0);
                      newItems.splice(index, 1);
                      newItems.splice(targetIndex, 0, draggedItem);
                      setItems(newItems);
                    }
                  }
                }}
              >
                <MediaItem
                  item={item}
                  className="absolute inset-0 w-full h-full bg-black"
                  onClick={() => !isDragging && setSelectedItem(item)}
                />

                {/* hover glow ring */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
                </div>

                {/* caption overlay - always subtle, stronger on hover */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  <h3 className="relative text-white text-xs sm:text-sm md:text-base font-medium line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="relative text-white/70 text-[10px] sm:text-xs md:text-sm mt-0.5 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.desc}
                  </p>
                </div>

                {/* "View" pill on hover */}
                <div className="pointer-events-none absolute top-2 right-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-background/80 backdrop-blur-md text-foreground border border-border/60">
                    View
                  </span>
                </div>
              </motion.div>
            ))}
            {Array((4 - (items.length % 4)) % 4)
              .fill(0)
              .map((_, i) => (
                <div key={`filler-${i}`} className="hidden md:block" />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveBentoGallery;