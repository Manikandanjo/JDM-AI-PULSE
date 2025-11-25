const STORAGE_KEY = 'jdm_blog_posts';
const METRICS_KEY = 'jdm_blog_metrics';

// --- Data Management ---

function getPosts() {
    const posts = localStorage.getItem(STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
}

function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function getMetrics() {
    const metrics = localStorage.getItem(METRICS_KEY);
    return metrics ? JSON.parse(metrics) : { visitors: 12453, likes: 8932 };
}

function saveMetrics(metrics) {
    localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// --- Metrics Logic ---

function initMetrics() {
    const metrics = getMetrics();

    // Simulate live visitor count update
    const visitorEl = document.getElementById('visitor-count');
    const heroVisitorEl = document.getElementById('hero-visitor-count');
    const likesEl = document.getElementById('total-likes');

    if (visitorEl) visitorEl.innerText = metrics.visitors.toLocaleString();
    if (heroVisitorEl) heroVisitorEl.innerText = metrics.visitors.toLocaleString();
    if (likesEl) likesEl.innerText = metrics.likes.toLocaleString();

    // Randomly increase visitors every few seconds to simulate activity
    setInterval(() => {
        metrics.visitors += Math.floor(Math.random() * 3);
        saveMetrics(metrics);
        if (visitorEl) visitorEl.innerText = metrics.visitors.toLocaleString();
        if (heroVisitorEl) heroVisitorEl.innerText = metrics.visitors.toLocaleString();
    }, 5000);
}

function incrementLikes() {
    const metrics = getMetrics();
    metrics.likes++;
    saveMetrics(metrics);

    const likesEl = document.getElementById('total-likes');
    if (likesEl) {
        likesEl.innerText = metrics.likes.toLocaleString();
        // Add a simple animation effect
        likesEl.classList.add('text-gold-500', 'scale-110');
        setTimeout(() => likesEl.classList.remove('text-gold-500', 'scale-110'), 200);
    }
}

// --- Index Page Logic ---

function loadPosts() {
    const feedContainer = document.getElementById('blog-feed');
    if (!feedContainer) return;

    let posts = getPosts();

    // If no posts, add some mock data for demonstration
    if (posts.length === 0) {
        posts = [
            {
                id: '1',
                title: 'The Future of Generative AI in Education',
                excerpt: 'How AI is transforming the way we learn and teach, making education more personalized and accessible than ever before.',
                content: 'Full content here...',
                publisher: 'Dr. M. Manikandan',
                date: new Date().toISOString(),
                image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: '2',
                title: 'Understanding Large Language Models',
                excerpt: 'A deep dive into the architecture behind GPT-4 and other LLMs, explained in simple terms for everyone.',
                content: 'Full content here...',
                publisher: 'Dr. M. Manikandan',
                date: new Date(Date.now() - 86400000).toISOString(),
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: '3',
                title: 'AI Ethics: Navigating the Grey Areas',
                excerpt: 'As AI becomes more powerful, we must address the ethical implications of bias, privacy, and automation.',
                content: 'Full content here...',
                publisher: 'Dr. M. Manikandan',
                date: new Date(Date.now() - 172800000).toISOString(),
                image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ];
        // Don't save these mock posts to storage to allow user to have a "clean" start if they want, 
        // or we can save them. Let's just use them for display if empty.
    }

    feedContainer.innerHTML = posts.map(post => `
        <article class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
            <div class="relative h-48 overflow-hidden">
                <img src="${post.image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" 
                     alt="${post.title}" 
                     class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span class="bg-gold-500 text-cherry-900 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Read Now</span>
                </div>
            </div>
            <div class="p-6 flex-grow flex flex-col">
                <div class="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                    <span class="flex items-center"><i class="far fa-calendar mr-1"></i> ${formatDate(post.date)}</span>
                    <span class="text-gold-400">•</span>
                    <span class="flex items-center"><i class="far fa-user mr-1"></i> ${post.publisher || 'Admin'}</span>
                </div>
                <h3 class="text-xl font-serif font-bold text-cherry-900 mb-3 leading-tight group-hover:text-cherry-700 transition-colors">
                    <a href="post.html?id=${post.id}">${post.title}</a>
                </h3>
                <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">${post.excerpt}</p>
                <a href="post.html?id=${post.id}" class="inline-flex items-center text-cherry-700 font-semibold text-sm hover:text-gold-600 transition-colors mt-auto">
                    Read Article <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </a>
            </div>
        </article>
    `).join('');
}

// --- Editor Page Logic ---

const postForm = document.getElementById('post-form');
if (postForm) {
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const excerpt = document.getElementById('excerpt').value;
        const content = document.getElementById('content').value;
        const publisher = document.getElementById('publisher').value;
        const image = document.getElementById('cover-image').value;

        if (!title || !content) {
            alert('Please fill in the title and content.');
            return;
        }

        const newPost = {
            id: generateId(),
            title,
            excerpt,
            content,
            publisher,
            image,
            date: new Date().toISOString()
        };

        const posts = getPosts();
        posts.unshift(newPost); // Add to beginning
        savePosts(posts);

        window.location.href = 'index.html';
    });
}

// --- Single Post Page Logic ---

function loadSinglePost() {
    const container = document.getElementById('post-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        container.innerHTML = '<div class="text-center py-20"><p class="text-xl text-gray-600">Post not found.</p><a href="index.html" class="mt-4 inline-block text-cherry-600 hover:underline">Go Home</a></div>';
        return;
    }

    let posts = getPosts();
    // Check mock posts if not found in storage (for demo purposes)
    if (posts.length === 0) {
        posts = [
            {
                id: '1',
                title: 'The Future of Generative AI in Education',
                excerpt: 'How AI is transforming the way we learn and teach...',
                content: 'Full content would go here. This is a mock post for demonstration.',
                publisher: 'Dr. M. Manikandan',
                date: new Date().toISOString(),
                image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: '2',
                title: 'Understanding Large Language Models',
                excerpt: 'A deep dive into the architecture behind GPT-4...',
                content: 'Full content would go here. This is a mock post for demonstration.',
                publisher: 'Dr. M. Manikandan',
                date: new Date(Date.now() - 86400000).toISOString(),
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: '3',
                title: 'AI Ethics: Navigating the Grey Areas',
                excerpt: 'As AI becomes more powerful, we must address the ethical implications...',
                content: 'Full content would go here. This is a mock post for demonstration.',
                publisher: 'Dr. M. Manikandan',
                date: new Date(Date.now() - 172800000).toISOString(),
                image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ];
    }

    const post = posts.find(p => p.id === postId);

    if (!post) {
        container.innerHTML = '<div class="text-center py-20"><p class="text-xl text-gray-600">Post not found.</p><a href="index.html" class="mt-4 inline-block text-cherry-600 hover:underline">Go Home</a></div>';
        return;
    }

    // Convert newlines to line breaks for simple text display
    const formattedContent = post.content.replace(/\n/g, '<br>');

    container.innerHTML = `
        <header class="text-center mb-12 border-b border-gray-200 pb-8">
            <div class="flex justify-center items-center space-x-4 text-sm text-gray-500 mb-4">
                <span class="flex items-center"><i class="far fa-calendar mr-2"></i> ${formatDate(post.date)}</span>
                <span class="text-gold-400">•</span>
                <span class="flex items-center"><i class="far fa-user mr-2"></i> ${post.publisher || 'Admin'}</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-serif font-bold text-cherry-900 mb-8 leading-tight">${post.title}</h1>
            <div class="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
                <img src="${post.image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}" 
                     alt="Cover Image" 
                     class="absolute inset-0 w-full h-full object-cover">
            </div>
        </header>
        <div class="prose prose-lg prose-cherry mx-auto text-gray-700">
            ${formattedContent}
        </div>
        <div class="mt-16 text-center">
            <a href="index.html" class="inline-flex items-center px-6 py-3 border border-cherry-900 text-cherry-900 font-semibold rounded-full hover:bg-cherry-900 hover:text-white transition-colors">
                <i class="fas fa-arrow-left mr-2"></i> Back to Home
            </a>
        </div>
    `;
}
