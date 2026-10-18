export default {
	async scheduled(controller, env, ctx) {
		ctx.waitUntil(updateAllUserStats(env));
	},

	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// CORS headers
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		try {
			// Add health check route
			if (url.pathname === '/' && request.method === 'GET') {
				return new Response(
					JSON.stringify({
						status: 'healthy',
						message: 'LeetCode Cron Worker is running!',
						timestamp: new Date().toISOString(),
						routes: ['/leaderboard', '/users', '/add-user', '/judge0/submit', '/judge0/submit-batch', '/judge0/submissions', '/judge0/submission/:token'],
					}),
					{
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					}
				);
			}

			// Judge0 proxy routes
			if (url.pathname === '/judge0/submit' && request.method === 'POST') {
				return await submitToJudge0(request, env, corsHeaders);
			}

			if (url.pathname === '/judge0/submit-batch' && request.method === 'POST') {
				return await submitBatchToJudge0(request, env, corsHeaders);
			}

			if (url.pathname === '/judge0/submissions' && request.method === 'GET') {
				return await getSubmissionBatchResults(url, env, corsHeaders);
			}

			if (url.pathname.startsWith('/judge0/submission/') && request.method === 'GET') {
				const token = url.pathname.split('/')[3];
				return await getSubmissionResult(token, env, corsHeaders);
			}

			if (url.pathname === '/leaderboard' && request.method === 'GET') {
				return await getLeaderboard(env, corsHeaders, url.searchParams);
			}

			// New route for adding user from leaderboard
			if (url.pathname === '/add-user' && request.method === 'POST') {
				return await addUserFromLeaderboard(request, env, corsHeaders);
			}

			if (url.pathname === '/users' && request.method === 'POST') {
				return await addUser(request, env, corsHeaders);
			}

			if (url.pathname === '/users' && request.method === 'GET') {
				return await getAllUsers(env, corsHeaders);
			}

			if (url.pathname.startsWith('/users/') && request.method === 'DELETE') {
				const username = url.pathname.split('/')[2];
				return await deleteUser(username, env, corsHeaders);
			}

			if (url.pathname.startsWith('/users/') && request.method === 'PUT') {
				const username = url.pathname.split('/')[2];
				return await updateUserBranch(request, username, env, corsHeaders);
			}

			return new Response(JSON.stringify({ error: 'Not found' }), {
				status: 404,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		} catch (error) {
			console.error('Worker error:', error);
			return new Response(JSON.stringify({ error: 'Internal server error' }), {
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}
	},
};

// Helper function to get IST timestamp
function getCurrentISTTimestamp() {
	const now = new Date();
	// Create a date in IST timezone
	const istDate = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Kolkata',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).formatToParts(now);

	const year = istDate.find((part) => part.type === 'year').value;
	const month = istDate.find((part) => part.type === 'month').value;
	const day = istDate.find((part) => part.type === 'day').value;
	const hour = istDate.find((part) => part.type === 'hour').value;
	const minute = istDate.find((part) => part.type === 'minute').value;
	const second = istDate.find((part) => part.type === 'second').value;

	return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// Extract year from branch
function extractYearFromBranch(branch) {
	if (!branch) return null;
	const yearMatch = branch.match(/^(FE|SE|TE|BE)/);
	return yearMatch ? yearMatch[1] : null;
}

// Initialize database tables
async function initDB(env) {
	try {
		await env.DB.prepare(
			`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                real_name TEXT,
                total_solved INTEGER DEFAULT 0,
                easy_solved INTEGER DEFAULT 0,
                medium_solved INTEGER DEFAULT 0,
                hard_solved INTEGER DEFAULT 0,
                ranking INTEGER DEFAULT 0,
                branch TEXT,
                year TEXT,
                added_at TEXT,
                updated_at TEXT
            )
        `
		).run();

		await env.DB.prepare(
			`
            CREATE INDEX IF NOT EXISTS idx_users_total_solved ON users(total_solved DESC)
        `
		).run();

		await env.DB.prepare(
			`
            CREATE INDEX IF NOT EXISTS idx_users_year ON users(year)
        `
		).run();

		await env.DB.prepare(
			`
            CREATE INDEX IF NOT EXISTS idx_users_branch ON users(branch)
        `
		).run();

		console.log('Database initialized successfully');
	} catch (error) {
		console.error('Database initialization error:', error);
	}
}

// New function for adding user from leaderboard with simplified input
async function addUserFromLeaderboard(request, env, corsHeaders) {
	try {
		await initDB(env);

		const { username, branch } = await request.json();

		if (!username || typeof username !== 'string' || username.trim() === '') {
			return new Response(JSON.stringify({ error: 'Username is required' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		if (!branch || typeof branch !== 'string' || branch.trim() === '') {
			return new Response(JSON.stringify({ error: 'Branch is required' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		const cleanUsername = username.trim().toLowerCase();
		const cleanBranch = branch.trim();
		const year = extractYearFromBranch(cleanBranch);

		// Check if user already exists
		const existingUser = await env.DB.prepare('SELECT username FROM users WHERE username = ?').bind(cleanUsername).first();

		if (existingUser) {
			return new Response(JSON.stringify({ error: 'User already exists in leaderboard' }), {
				status: 409,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		// Fetch user data from LeetCode API to validate username
		const response = await fetch(`https://leetcode-api-pied.vercel.app/user/${cleanUsername}`, {
			headers: { 'User-Agent': 'CodeStorm-Leaderboard-Bot/1.0' },
		});

		if (!response.ok) {
			return new Response(JSON.stringify({ error: 'LeetCode username not found' }), {
				status: 404,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		const userData = await response.json();

		// Extract stats
		const totalSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'All')?.count || 0;
		const easySolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Easy')?.count || 0;
		const mediumSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Medium')?.count || 0;
		const hardSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Hard')?.count || 0;

		// Add user to database with IST timestamp
		await env.DB.prepare(
			`INSERT INTO users (
          username, real_name, total_solved, easy_solved, medium_solved, 
          hard_solved, ranking, branch, year, added_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				cleanUsername,
				userData.profile?.realName || cleanUsername,
				totalSolved,
				easySolved,
				mediumSolved,
				hardSolved,
				userData.profile?.ranking || 0,
				cleanBranch,
				year,
				getCurrentISTTimestamp(),
				getCurrentISTTimestamp()
			)
			.run();

		return new Response(
			JSON.stringify({
				message: 'User added to leaderboard successfully',
				username: cleanUsername,
				realName: userData.profile?.realName || cleanUsername,
				totalSolved: totalSolved,
			}),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Add user from leaderboard error:', error);
		return new Response(JSON.stringify({ error: 'Failed to add user to leaderboard' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}

async function addUser(request, env, corsHeaders) {
	try {
		await initDB(env);

		const { username, branch } = await request.json();

		if (!username || typeof username !== 'string' || username.trim() === '') {
			return new Response(JSON.stringify({ error: 'Username is required' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		const cleanUsername = username.trim().toLowerCase();
		const year = extractYearFromBranch(branch);

		// Check if user already exists
		const existingUser = await env.DB.prepare('SELECT username FROM users WHERE username = ?').bind(cleanUsername).first();

		if (existingUser) {
			return new Response(JSON.stringify({ error: 'User already exists' }), {
				status: 409,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		// Fetch user data from LeetCode API to validate username
		const response = await fetch(`https://leetcode-api-pied.vercel.app/user/${cleanUsername}`, {
			headers: { 'User-Agent': 'CodeStorm-Leaderboard-Bot/1.0' },
		});

		if (!response.ok) {
			return new Response(JSON.stringify({ error: 'LeetCode username not found' }), {
				status: 404,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		const userData = await response.json();

		// Extract stats
		const totalSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'All')?.count || 0;
		const easySolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Easy')?.count || 0;
		const mediumSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Medium')?.count || 0;
		const hardSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Hard')?.count || 0;

		// Add user to database with IST timestamp
		await env.DB.prepare(
			`INSERT INTO users (
                username, real_name, total_solved, easy_solved, medium_solved, 
                hard_solved, ranking, branch, year, added_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
			.bind(
				cleanUsername,
				userData.profile?.realName || cleanUsername,
				totalSolved,
				easySolved,
				mediumSolved,
				hardSolved,
				userData.profile?.ranking || 0,
				branch || null,
				year,
				getCurrentISTTimestamp(),
				getCurrentISTTimestamp()
			)
			.run();

		return new Response(
			JSON.stringify({
				message: 'User added successfully',
				username: cleanUsername,
			}),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Add user error:', error);
		return new Response(JSON.stringify({ error: 'Failed to add user' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}

async function updateUserBranch(request, username, env, corsHeaders) {
	try {
		const { branch } = await request.json();
		const year = extractYearFromBranch(branch);

		await env.DB.prepare('UPDATE users SET branch = ?, year = ?, updated_at = ? WHERE username = ?')
			.bind(branch, year, getCurrentISTTimestamp(), username.toLowerCase())
			.run();

		return new Response(JSON.stringify({ message: 'User branch updated successfully' }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Update user branch error:', error);
		return new Response(JSON.stringify({ error: 'Failed to update user branch' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}

async function deleteUser(username, env, corsHeaders) {
	try {
		const result = await env.DB.prepare('DELETE FROM users WHERE username = ?').bind(username.toLowerCase()).run();

		if (result.changes === 0) {
			return new Response(JSON.stringify({ error: 'User not found' }), {
				status: 404,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Delete user error:', error);
		return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}

async function getAllUsers(env, corsHeaders) {
	try {
		await initDB(env);

		// Fetch all user data including stats
		const users = await env.DB.prepare(
			`
            SELECT username, real_name, total_solved, easy_solved, medium_solved, 
                   hard_solved, ranking, branch, year, added_at, updated_at 
            FROM users 
            ORDER BY added_at DESC
        `
		).all();

		return new Response(JSON.stringify({ users: users.results || [] }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Get users error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}

async function updateAllUserStats(env) {
	try {
		await initDB(env);
		console.log('Starting leaderboard update...');

		// Get all users from database
		const usersResult = await env.DB.prepare('SELECT username, branch, year FROM users').all();
		const users = usersResult.results || [];

		if (users.length === 0) {
			console.log('No users to update');
			return;
		}

		for (const user of users) {
			try {
				console.log(`Fetching data for ${user.username}...`);

				const response = await fetch(`https://leetcode-api-pied.vercel.app/user/${user.username}`, {
					headers: { 'User-Agent': 'CodeStorm-Leaderboard-Bot/1.0' },
				});

				if (!response.ok) {
					console.error(`Failed to fetch data for ${user.username}: ${response.status}`);
					continue;
				}

				const userData = await response.json();

				// Extract stats
				const totalSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'All')?.count || 0;
				const easySolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Easy')?.count || 0;
				const mediumSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Medium')?.count || 0;
				const hardSolved = userData.submitStats?.acSubmissionNum?.find((s) => s.difficulty === 'Hard')?.count || 0;

				// Update user stats with IST timestamp
				await env.DB.prepare(
					`UPDATE users SET 
                        real_name = ?, total_solved = ?, easy_solved = ?, medium_solved = ?, 
                        hard_solved = ?, ranking = ?, updated_at = ?
                    WHERE username = ?`
				)
					.bind(
						userData.profile?.realName || user.username,
						totalSolved,
						easySolved,
						mediumSolved,
						hardSolved,
						userData.profile?.ranking || 0,
						getCurrentISTTimestamp(),
						user.username
					)
					.run();

				// Small delay to avoid rate limiting
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (error) {
				console.error(`Error updating ${user.username}:`, error);
			}
		}

		console.log(`Leaderboard updated successfully with ${users.length} users`);
	} catch (error) {
		console.error('Update all users error:', error);
	}
}

async function getLeaderboard(env, corsHeaders, searchParams) {
	try {
		await initDB(env);

		const sortBy = searchParams.get('sortBy') || 'total';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');
		const offset = (page - 1) * limit;

		let orderBy = 'total_solved DESC, username ASC';

		switch (sortBy) {
			case 'total':
				orderBy = 'total_solved DESC, username ASC';
				break;
			case 'easy':
				orderBy = 'easy_solved DESC, username ASC';
				break;
			case 'medium':
				orderBy = 'medium_solved DESC, username ASC';
				break;
			case 'hard':
				orderBy = 'hard_solved DESC, username ASC';
				break;
			case 'ranking':
				orderBy = 'ranking ASC, username ASC';
				break;
			default:
				orderBy = 'total_solved DESC, username ASC';
		}

		// Get total count for pagination
		const countResult = await env.DB.prepare('SELECT COUNT(*) as total FROM users').first();
		const totalUsers = countResult.total || 0;

		const result = await env.DB.prepare(
			`
            SELECT 
                username, real_name, total_solved, easy_solved, medium_solved, 
                hard_solved, ranking, branch, year, updated_at
            FROM users
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?
        `
		)
			.bind(limit, offset)
			.all();

		const leaderboardData = (result.results || []).map((user, index) => ({
			username: user.username,
			ranking: user.ranking || 0,
			totalSolved: user.total_solved || 0,
			easySolved: user.easy_solved || 0,
			mediumSolved: user.medium_solved || 0,
			hardSolved: user.hard_solved || 0,
			branch: user.branch,
			year: user.year,
			lastUpdated: user.updated_at,
			profile: {
				realName: user.real_name || user.username,
			},
			// Calculate rank based on offset and index
			rank: offset + index + 1,
		}));

		const lastUpdated =
			leaderboardData.length > 0
				? leaderboardData.reduce(
						(latest, user) => (new Date(user.lastUpdated || 0) > new Date(latest || 0) ? user.lastUpdated : latest),
						null
				  )
				: getCurrentISTTimestamp();

		return new Response(
			JSON.stringify({
				data: leaderboardData,
				lastUpdated: lastUpdated,
				totalUsers: totalUsers,
				currentPage: page,
				totalPages: Math.ceil(totalUsers / limit),
				hasNextPage: page < Math.ceil(totalUsers / limit),
				hasPrevPage: page > 1,
				sortBy: sortBy,
			}),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
			}
		);
	} catch (error) {
		console.error('Get leaderboard error:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}

// Judge0 API integration functions
const getJudge0APIKey = (env) => {
	// Get all available API keys from environment
	const keys = [];
	for (let i = 1; i <= 39; i++) {
		const key = env[`JUDGE0_API_KEY_${i}`];
		if (key) {
			keys.push(key);
		}
	}
	
	if (keys.length === 0) {
		throw new Error('No Judge0 API keys configured');
	}
	
	// Return a random key to distribute load
	return keys[Math.floor(Math.random() * keys.length)];
};

async function submitToJudge0(request, env, corsHeaders) {
	try {
		const { source_code, language_id, stdin } = await request.json();
		
		const apiKey = getJudge0APIKey(env);
		const judge0Url = env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
		
		const response = await fetch(`${judge0Url}/submissions?base64_encoded=true&wait=false`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-RapidAPI-Key': apiKey,
				'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
			},
			body: JSON.stringify({
				source_code: btoa(source_code),
				language_id: language_id,
				stdin: btoa(stdin || ''),
				base64_encoded: true
			})
		});

		if (!response.ok) {
			throw new Error(`Judge0 API error: ${response.status}`);
		}

		const result = await response.json();
		
		return new Response(JSON.stringify(result), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Submit to Judge0 error:', error);
		return new Response(JSON.stringify({ error: 'Failed to submit code' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
}

async function submitBatchToJudge0(request, env, corsHeaders) {
	try {
		const { submissions } = await request.json();
		
		const apiKey = getJudge0APIKey(env);
		const judge0Url = env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
		
		const response = await fetch(`${judge0Url}/submissions/batch?base64_encoded=true`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-RapidAPI-Key': apiKey,
				'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
			},
			body: JSON.stringify({
				submissions: submissions.map(sub => ({
					source_code: btoa(sub.source_code),
					language_id: sub.language_id,
					stdin: btoa(sub.stdin || ''),
					base64_encoded: true
				}))
			})
		});

		if (!response.ok) {
			throw new Error(`Judge0 API error: ${response.status}`);
		}

		const result = await response.json();
		
		return new Response(JSON.stringify(result), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Submit batch to Judge0 error:', error);
		return new Response(JSON.stringify({ error: 'Failed to submit batch' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
}

async function getSubmissionResult(token, env, corsHeaders) {
	try {
		const apiKey = getJudge0APIKey(env);
		const judge0Url = env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
		
		const response = await fetch(`${judge0Url}/submissions/${token}?base64_encoded=true`, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': apiKey,
				'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
			}
		});

		if (!response.ok) {
			throw new Error(`Judge0 API error: ${response.status}`);
		}

		const result = await response.json();
		
		// Decode base64 outputs
		const decoded = {
			...result,
			status: result.status?.description || result.status || 'Unknown',
			output: result.stdout ? atob(result.stdout) : '',
			error: result.stderr ? atob(result.stderr) : '',
			statusId: result.status?.id || result.status_id || 0
		};
		
		return new Response(JSON.stringify(decoded), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Get submission result error:', error);
		return new Response(JSON.stringify({ error: 'Failed to get submission result' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
}

async function getSubmissionBatchResults(url, env, corsHeaders) {
	try {
		const tokens = url.searchParams.get('tokens');
		if (!tokens) {
			return new Response(JSON.stringify({ error: 'No tokens provided' }), {
				status: 400,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			});
		}
		
		const apiKey = getJudge0APIKey(env);
		const judge0Url = env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
		
		const response = await fetch(`${judge0Url}/submissions/batch?tokens=${tokens}&base64_encoded=true`, {
			method: 'GET',
			headers: {
				'X-RapidAPI-Key': apiKey,
				'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
			}
		});

		if (!response.ok) {
			throw new Error(`Judge0 API error: ${response.status}`);
		}

		const result = await response.json();
		
		// Handle different response structures
		let submissions = [];
		if (result.submissions) {
			submissions = result.submissions;
		} else if (Array.isArray(result)) {
			submissions = result;
		}
		
		// Decode base64 outputs for each submission
		const decoded = {
			submissions: submissions.map(submission => {
				if (!submission) {
					return {
						status: 'Unknown',
						output: '',
						error: 'No submission data',
						time: null,
						memory: null,
						statusId: 0,
						token: null
					};
				}

				return {
					status: submission.status?.description || submission.status || 'Unknown',
					output: submission.stdout ? atob(submission.stdout) : '',
					error: submission.stderr ? atob(submission.stderr) : '',
					time: submission.time,
					memory: submission.memory,
					statusId: submission.status?.id || submission.status_id || 0,
					token: submission.token
				};
			})
		};
		
		return new Response(JSON.stringify(decoded), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Get batch results error:', error);
		return new Response(JSON.stringify({ error: 'Failed to get batch results' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	}
}
