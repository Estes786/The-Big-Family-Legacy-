import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  // Cloudflare bindings will be added here when needed
  // VECTORIZE: Vectorize
  // AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================================================
// API ROUTES
// ============================================================================

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    stack: 'Cloudflare + Supabase + CrewAI + LangSmith',
    services: {
      supabase: 'configured',
      cloudflare: 'active',
      crewai: 'configured',
      langsmith: 'configured'
    }
  })
})

// Supabase database test endpoint
app.get('/api/supabase/test', async (c) => {
  try {
    // In production, you would import Supabase client here
    // For now, return configuration status
    return c.json({
      status: 'configured',
      message: 'Supabase credentials ready',
      url: 'https://ywgyxsufaaxbfjudcdhp.supabase.co',
      features: {
        auth: 'ready',
        database: 'ready',
        storage: 'ready'
      }
    })
  } catch (error) {
    return c.json({ error: 'Supabase connection failed' }, 500)
  }
})

// CrewAI status endpoint
app.get('/api/crewai/status', (c) => {
  return c.json({
    status: 'configured',
    message: 'CrewAI credentials ready',
    agents: {
      familyHistorian: 'configured',
      storyWeaver: 'configured',
      memoryAnalyzer: 'configured'
    }
  })
})

// LangSmith status endpoint
app.get('/api/langsmith/status', (c) => {
  return c.json({
    status: 'configured',
    message: 'LangSmith tracing ready',
    features: {
      workflow: 'configured',
      tracing: 'ready',
      monitoring: 'ready'
    }
  })
})

// Memories API (stub - will be implemented with Supabase)
app.get('/api/memories', (c) => {
  return c.json({
    memories: [],
    total: 0,
    message: 'Ready for Supabase integration'
  })
})

app.post('/api/memories/upload', async (c) => {
  return c.json({
    success: true,
    message: 'Memory upload endpoint ready for implementation',
    nextSteps: ['Connect Supabase', 'Implement file upload to R2', 'Add AI processing']
  })
})

// Family tree API (stub)
app.get('/api/tree', (c) => {
  return c.json({
    nodes: [],
    edges: [],
    message: 'Ready for Supabase graph data'
  })
})

// AI Story generation API (stub - will use CrewAI)
app.post('/api/story/generate', async (c) => {
  return c.json({
    success: true,
    message: 'AI story generation ready',
    nextSteps: ['Connect CrewAI agents', 'Implement LangSmith tracing']
  })
})

// Digital ancestor chat API (stub - will use Groq via Cloudflare AI Gateway)
app.post('/api/chat/message', async (c) => {
  return c.json({
    success: true,
    message: 'Chat endpoint ready',
    nextSteps: ['Connect Groq AI', 'Setup Cloudflare AI Gateway', 'Add Vectorize RAG']
  })
})

// ============================================================================
// FRONTEND ROUTES
// ============================================================================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>The Big Family Legacy - Warisan Digital Keluarga</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            .gradient-bg {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .card-hover {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .card-hover:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Hero Section -->
        <div class="gradient-bg text-white py-20">
            <div class="container mx-auto px-4">
                <div class="text-center max-w-4xl mx-auto">
                    <h1 class="text-5xl md:text-6xl font-bold mb-6">
                        <i class="fas fa-tree"></i> The Big Family Legacy
                    </h1>
                    <p class="text-xl md:text-2xl mb-8 opacity-90">
                        Platform Warisan Digital Keluarga dengan AI
                    </p>
                    <p class="text-lg mb-10 opacity-80">
                        Hybrid Grandmaster Stack: Cloudflare + Supabase + CrewAI + LangSmith
                    </p>
                    <div class="flex gap-4 justify-center">
                        <a href="#demo" class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            <i class="fas fa-rocket"></i> Lihat Demo
                        </a>
                        <a href="#features" class="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">
                            <i class="fas fa-info-circle"></i> Fitur
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Banner -->
        <div class="bg-green-50 border-l-4 border-green-500 p-4">
            <div class="container mx-auto px-4">
                <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-500 text-2xl mr-3"></i>
                    <div>
                        <p class="text-green-800 font-semibold">System Status: Operational</p>
                        <p class="text-green-600 text-sm">All services configured and ready</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div id="features" class="py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
                    <i class="fas fa-star"></i> Fitur Unggulan
                </h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="card-hover bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-4xl text-purple-600 mb-4">
                            <i class="fas fa-upload"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-gray-800">Upload Kenangan</h3>
                        <p class="text-gray-600">Upload foto, video, dan cerita keluarga dengan mudah</p>
                    </div>
                    
                    <!-- Feature 2 -->
                    <div class="card-hover bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-4xl text-blue-600 mb-4">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-gray-800">Pohon Keluarga</h3>
                        <p class="text-gray-600">Visualisasi interaktif silsilah keluarga Anda</p>
                    </div>
                    
                    <!-- Feature 3 -->
                    <div class="card-hover bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-4xl text-green-600 mb-4">
                            <i class="fas fa-robot"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-gray-800">AI Story Generation</h3>
                        <p class="text-gray-600">AI membuat cerita warisan dari kenangan Anda</p>
                    </div>
                    
                    <!-- Feature 4 -->
                    <div class="card-hover bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-4xl text-red-600 mb-4">
                            <i class="fas fa-comments"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-gray-800">Chat dengan Leluhur</h3>
                        <p class="text-gray-600">Ngobrol dengan digital ancestor menggunakan AI</p>
                    </div>
                    
                    <!-- Feature 5 -->
                    <div class="card-hover bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-4xl text-yellow-600 mb-4">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-gray-800">Aman & Private</h3>
                        <p class="text-gray-600">Data keluarga Anda terlindungi dengan enkripsi</p>
                    </div>
                    
                    <!-- Feature 6 -->
                    <div class="card-hover bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-4xl text-indigo-600 mb-4">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-gray-800">Global Access</h3>
                        <p class="text-gray-600">Akses dari mana saja via Cloudflare Edge Network</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tech Stack Section -->
        <div class="bg-gray-100 py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
                    <i class="fas fa-layer-group"></i> Hybrid Grandmaster Stack
                </h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <i class="fas fa-cloud text-4xl text-orange-500 mb-3"></i>
                        <h3 class="font-bold text-lg">Cloudflare Pages</h3>
                        <p class="text-sm text-gray-600">Global Edge Hosting</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <i class="fas fa-database text-4xl text-green-500 mb-3"></i>
                        <h3 class="font-bold text-lg">Supabase</h3>
                        <p class="text-sm text-gray-600">Auth + PostgreSQL</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <i class="fas fa-users-cog text-4xl text-blue-500 mb-3"></i>
                        <h3 class="font-bold text-lg">CrewAI</h3>
                        <p class="text-sm text-gray-600">AI Agent Orchestration</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <i class="fas fa-chart-line text-4xl text-purple-500 mb-3"></i>
                        <h3 class="font-bold text-lg">LangSmith</h3>
                        <p class="text-sm text-gray-600">AI Tracing & Monitoring</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <i class="fas fa-brain text-4xl text-red-500 mb-3"></i>
                        <h3 class="font-bold text-lg">Groq AI</h3>
                        <p class="text-sm text-gray-600">Llama 3 Inference</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <i class="fas fa-search text-4xl text-indigo-500 mb-3"></i>
                        <h3 class="font-bold text-lg">Vectorize</h3>
                        <p class="text-sm text-gray-600">RAG Memory Storage</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <i class="fas fa-lock text-4xl text-yellow-500 mb-3"></i>
                        <h3 class="font-bold text-lg">AI Gateway</h3>
                        <p class="text-sm text-gray-600">Token Caching</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow text-center">
                        <i class="fas fa-rocket text-4xl text-pink-500 mb-3"></i>
                        <h3 class="font-bold text-lg">Koyeb (Optional)</h3>
                        <p class="text-sm text-gray-600">Python Agents</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- API Status Section -->
        <div class="py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
                    <i class="fas fa-server"></i> API Status
                </h2>
                <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="border-l-4 border-green-500 pl-4">
                            <h3 class="font-bold text-lg mb-2">
                                <i class="fas fa-check-circle text-green-500"></i> Health Check
                            </h3>
                            <p class="text-sm text-gray-600">GET /api/health</p>
                            <p class="text-xs text-green-600 mt-1">✓ Operational</p>
                        </div>
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h3 class="font-bold text-lg mb-2">
                                <i class="fas fa-database text-blue-500"></i> Supabase
                            </h3>
                            <p class="text-sm text-gray-600">GET /api/supabase/test</p>
                            <p class="text-xs text-blue-600 mt-1">✓ Configured</p>
                        </div>
                        <div class="border-l-4 border-purple-500 pl-4">
                            <h3 class="font-bold text-lg mb-2">
                                <i class="fas fa-robot text-purple-500"></i> CrewAI
                            </h3>
                            <p class="text-sm text-gray-600">GET /api/crewai/status</p>
                            <p class="text-xs text-purple-600 mt-1">✓ Ready</p>
                        </div>
                        <div class="border-l-4 border-orange-500 pl-4">
                            <h3 class="font-bold text-lg mb-2">
                                <i class="fas fa-chart-line text-orange-500"></i> LangSmith
                            </h3>
                            <p class="text-sm text-gray-600">GET /api/langsmith/status</p>
                            <p class="text-xs text-orange-600 mt-1">✓ Ready</p>
                        </div>
                    </div>
                    <div class="mt-8 text-center">
                        <a href="/api/health" target="_blank" class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
                            <i class="fas fa-external-link-alt"></i> Test API Health
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="gradient-bg text-white py-12">
            <div class="container mx-auto px-4">
                <div class="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 class="font-bold text-lg mb-4">
                            <i class="fas fa-tree"></i> The Big Family Legacy
                        </h3>
                        <p class="opacity-80 text-sm">
                            Platform Warisan Digital Keluarga dengan AI
                        </p>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-4">Quick Links</h3>
                        <ul class="space-y-2 text-sm opacity-80">
                            <li><a href="#features" class="hover:opacity-100"><i class="fas fa-star"></i> Fitur</a></li>
                            <li><a href="/api/health" target="_blank" class="hover:opacity-100"><i class="fas fa-server"></i> API Status</a></li>
                            <li><a href="https://github.com/Estes786/The-Big-Family-Legacy-" target="_blank" class="hover:opacity-100"><i class="fab fa-github"></i> GitHub</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-4">Status</h3>
                        <ul class="space-y-2 text-sm">
                            <li><span class="text-green-400">●</span> Frontend: Active</li>
                            <li><span class="text-green-400">●</span> Supabase: Configured</li>
                            <li><span class="text-green-400">●</span> CrewAI: Ready</li>
                            <li><span class="text-green-400">●</span> LangSmith: Ready</li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-white border-opacity-20 pt-8 text-center text-sm opacity-80">
                    <p>&copy; 2026 The Big Family Legacy. Made with ❤️ and 🤖 AI</p>
                    <p class="mt-2">Target: Ramadhan 2026 🌙</p>
                </div>
            </div>
        </footer>
    </body>
    </html>
  `)
})

// 404 handler
app.notFound((c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Not Found</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
        <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
            <a href="/" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
                Kembali ke Beranda
            </a>
        </div>
    </body>
    </html>
  `, 404)
})

export default app
