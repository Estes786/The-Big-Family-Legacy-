import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for backend API integration
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok',
    service: 'THE BIG FAMILY LEGACY - Frontend',
    timestamp: new Date().toISOString()
  })
})

// Homepage
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>THE BIG FAMILY LEGACY 🌳</title>
        <meta name="description" content="Platform Warisan Digital Keluarga dengan AI">
        
        <!-- TailwindCSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- FontAwesome Icons -->
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
            body {
                font-family: 'Inter', sans-serif;
            }
            .gradient-bg {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .hero-pattern {
                background-color: #667eea;
                background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            }
            .card-hover {
                transition: all 0.3s ease;
            }
            .card-hover:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <i class="fas fa-tree text-purple-600 text-2xl mr-3"></i>
                        <span class="text-xl font-bold text-gray-800">THE BIG FAMILY LEGACY</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button id="loginBtn" class="text-gray-600 hover:text-purple-600 font-medium">
                            <i class="fas fa-sign-in-alt mr-2"></i>Login
                        </button>
                        <button id="registerBtn" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                            <i class="fas fa-user-plus mr-2"></i>Daftar
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="hero-pattern text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div class="animate-fade-in">
                    <i class="fas fa-tree text-6xl mb-6 opacity-90"></i>
                    <h1 class="text-5xl font-bold mb-6">
                        Warisan Keluarga untuk Generasi Mendatang
                    </h1>
                    <p class="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                        Platform digital yang menggunakan AI untuk menyimpan foto, cerita, dan memori keluarga besar Anda. 
                        Biarkan generasi masa depan mengenal leluhur mereka.
                    </p>
                    <div class="flex justify-center space-x-4">
                        <button class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
                            <i class="fas fa-rocket mr-2"></i>Mulai Sekarang
                        </button>
                        <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">
                            <i class="fas fa-play mr-2"></i>Lihat Demo
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-bold text-gray-800 mb-4">
                        Fitur-Fitur Unggulan
                    </h2>
                    <p class="text-xl text-gray-600">
                        Powered by AI untuk pengalaman terbaik
                    </p>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <!-- Feature 1 -->
                    <div class="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl card-hover">
                        <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-camera text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">
                            Upload Memori
                        </h3>
                        <p class="text-gray-600">
                            Simpan foto, video, dan dokumen penting keluarga dengan aman di cloud
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl card-hover">
                        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-robot text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">
                            AI Caption
                        </h3>
                        <p class="text-gray-600">
                            AI otomatis membuat deskripsi dan mendeteksi wajah di foto keluarga
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl card-hover">
                        <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-project-diagram text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">
                            Pohon Silsilah
                        </h3>
                        <p class="text-gray-600">
                            Bangun dan visualisasi pohon keluarga interaktif hingga 10 generasi
                        </p>
                    </div>

                    <!-- Feature 4 -->
                    <div class="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl card-hover">
                        <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-book text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">
                            Story Generator
                        </h3>
                        <p class="text-gray-600">
                            AI menulis cerita sejarah keluarga dari foto dan memori yang tersimpan
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="py-16 gradient-bg text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div class="text-4xl font-bold mb-2">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="text-3xl font-bold">1000+</div>
                        <div class="text-purple-200">Keluarga Terdaftar</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold mb-2">
                            <i class="fas fa-images"></i>
                        </div>
                        <div class="text-3xl font-bold">50K+</div>
                        <div class="text-purple-200">Foto & Video</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold mb-2">
                            <i class="fas fa-tree"></i>
                        </div>
                        <div class="text-3xl font-bold">500+</div>
                        <div class="text-purple-200">Pohon Silsilah</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold mb-2">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <div class="text-3xl font-bold">2K+</div>
                        <div class="text-purple-200">Cerita AI</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-4xl font-bold text-gray-800 mb-6">
                    Siap Memulai Warisan Digital Keluarga Anda?
                </h2>
                <p class="text-xl text-gray-600 mb-8">
                    Bergabung sekarang dan abadikan cerita keluarga besar Anda untuk generasi mendatang
                </p>
                <button class="bg-purple-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition shadow-lg">
                    <i class="fas fa-rocket mr-2"></i>Daftar Gratis Sekarang
                </button>
                <p class="text-gray-500 mt-4">
                    🎯 Target Launch: Ramadhan 2026 | Free Beta Access
                </p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid md:grid-cols-4 gap-8">
                    <div>
                        <div class="flex items-center mb-4">
                            <i class="fas fa-tree text-purple-400 text-2xl mr-2"></i>
                            <span class="font-bold text-lg">THE BIG FAMILY LEGACY</span>
                        </div>
                        <p class="text-gray-400">
                            Platform warisan digital untuk keluarga Indonesia
                        </p>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Product</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white">Fitur</a></li>
                            <li><a href="#" class="hover:text-white">Harga</a></li>
                            <li><a href="#" class="hover:text-white">Demo</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Company</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white">Tentang</a></li>
                            <li><a href="#" class="hover:text-white">Blog</a></li>
                            <li><a href="#" class="hover:text-white">Kontak</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-4">Legal</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white">Privacy</a></li>
                            <li><a href="#" class="hover:text-white">Terms</a></li>
                            <li><a href="#" class="hover:text-white">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>© 2026 THE BIG FAMILY LEGACY. Built with ❤️ for families.</p>
                    <p class="mt-2">
                        <i class="fas fa-code mr-2"></i>Powered by Cloudflare Pages + Hono + Python AI Agents
                    </p>
                </div>
            </div>
        </footer>

        <!-- Simple JavaScript -->
        <script>
            // Simple console log for testing
            console.log('THE BIG FAMILY LEGACY - Frontend loaded ✅');
            
            // Add event listeners
            document.getElementById('loginBtn')?.addEventListener('click', () => {
                alert('Login feature coming soon! 🚀');
            });
            
            document.getElementById('registerBtn')?.addEventListener('click', () => {
                alert('Registration feature coming soon! 🚀');
            });
        </script>
    </body>
    </html>
  `)
})

// About page
app.get('/about', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tentang Kami - THE BIG FAMILY LEGACY</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 py-16">
            <h1 class="text-4xl font-bold text-gray-800 mb-6">
                <i class="fas fa-info-circle text-purple-600 mr-3"></i>
                Tentang THE BIG FAMILY LEGACY
            </h1>
            <div class="bg-white rounded-lg shadow-md p-8 prose prose-lg">
                <h2>Visi</h2>
                <p>Membantu keluarga besar Indonesia melestarikan warisan digital mereka untuk generasi mendatang.</p>
                
                <h2>Misi</h2>
                <ul>
                    <li>Menyediakan platform yang mudah digunakan untuk menyimpan memori keluarga</li>
                    <li>Menggunakan AI untuk membantu dokumentasi dan narasi sejarah keluarga</li>
                    <li>Menjaga privasi dan keamanan data keluarga dengan standar tertinggi</li>
                </ul>
                
                <h2>Technology Stack</h2>
                <ul>
                    <li><strong>Frontend</strong>: Cloudflare Pages + Hono + TailwindCSS</li>
                    <li><strong>Backend</strong>: Python FastAPI + CrewAI + LangGraph</li>
                    <li><strong>Database</strong>: Supabase PostgreSQL</li>
                    <li><strong>Storage</strong>: Cloudflare R2</li>
                    <li><strong>AI Models</strong>: GPT-4o, BLIP-2, Llama 3.1</li>
                </ul>
                
                <div class="mt-8">
                    <a href="/" class="text-purple-600 hover:text-purple-700 font-semibold">
                        <i class="fas fa-arrow-left mr-2"></i>Kembali ke Beranda
                    </a>
                </div>
            </div>
        </div>
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
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50 flex items-center justify-center min-h-screen">
        <div class="text-center">
            <i class="fas fa-search text-6xl text-gray-400 mb-4"></i>
            <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
            <a href="/" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
                <i class="fas fa-home mr-2"></i>Kembali ke Beranda
            </a>
        </div>
    </body>
    </html>
  `, 404)
})

export default app
