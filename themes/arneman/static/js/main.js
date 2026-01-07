// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navToggle.contains(event.target) || navLinks.contains(event.target);
            if (!isClickInside && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll Reveal Animation
    const scrollElements = document.querySelectorAll('.scroll-reveal');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('active');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Initial check for elements in view
    handleScrollAnimation();

    // Shuffle recommendations on page load
    function shuffleRecommendations() {
        const grid = document.getElementById('recommendationsGrid');
        if (!grid) return;

        const cards = Array.from(grid.children);

        // Fisher-Yates shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        cards.forEach(card => grid.appendChild(card));
    }

    // Run shuffle if recommendations section exists
    if (document.getElementById('recommendationsGrid')) {
        shuffleRecommendations();
    }

    // Fetch Latest YouTube Video
    async function fetchLatestYouTube() {
        const youtubeContent = document.getElementById('youtube-content');
        if (!youtubeContent) return;

        const YOUTUBE_API_KEY = 'AIzaSyB8qAjq1rbjgDli6iSFPPxWeEpazmkI5FE';
        const CHANNEL_ID = 'UCPxvqIgJxavwDjRBKyvvIng'; // bearlikelion channel ID

        if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
            youtubeContent.innerHTML = `
                <div class="latest-error">
                    <p>YouTube API key not configured.</p>
                    <p style="font-size: 13px; margin-top: 8px;">Add your API key to <code>themes/arneman/static/js/main.js</code></p>
                </div>
            `;
            return;
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&type=video`
            );
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const video = data.items[0];
                const videoId = video.id.videoId;
                const title = video.snippet.title;
                const thumbnail = video.snippet.thumbnails.high.url;
                const publishedAt = new Date(video.snippet.publishedAt);
                const timeAgo = getTimeAgo(publishedAt);
                const description = video.snippet.description;

                // Truncate description to ~200 characters
                const truncatedDescription = description.length > 200
                    ? description.substring(0, 200).trim() + '...'
                    : description;

                youtubeContent.innerHTML = `
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="latest-link">
                        <div class="latest-thumbnail">
                            <img src="${thumbnail}" alt="${title}">
                            <div class="latest-play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="latest-info">
                            <h4>${title}</h4>
                            <p class="latest-description">${truncatedDescription}</p>
                            <p class="latest-date"><i class="fas fa-clock"></i> ${timeAgo}</p>
                        </div>
                    </a>
                `;
            } else {
                youtubeContent.innerHTML = '<div class="latest-error">No videos found</div>';
            }
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
            youtubeContent.innerHTML = '<div class="latest-error">Failed to load video</div>';
        }
    }

    // Fetch Latest GitHub Repo
    async function fetchLatestGitHub() {
        const githubContent = document.getElementById('github-content');
        if (!githubContent) return;

        const GITHUB_USERNAME = 'bearlikelion';

        try {
            const response = await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=created&direction=desc&per_page=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const repo = data[0];
                const name = repo.name;
                const description = repo.description || 'No description provided';
                const url = repo.html_url;
                const language = repo.language || 'Unknown';
                const stars = repo.stargazers_count;
                const createdAt = new Date(repo.created_at);
                const timeAgo = getTimeAgo(createdAt);

                // Fetch README
                let readmeText = '';
                try {
                    const readmeResponse = await fetch(
                        `https://api.github.com/repos/${GITHUB_USERNAME}/${name}/readme`,
                        {
                            headers: {
                                'Accept': 'application/vnd.github.v3.raw'
                            }
                        }
                    );

                    if (readmeResponse.ok) {
                        const readmeContent = await readmeResponse.text();
                        // Remove markdown headers, links, code blocks for cleaner display
                        let cleanedReadme = readmeContent
                            .replace(/^#+\s+/gm, '') // Remove markdown headers
                            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
                            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
                            .replace(/`([^`]+)`/g, '$1') // Remove inline code formatting
                            .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
                            .replace(/\n\s*\n/g, '\n') // Remove extra newlines
                            .trim();

                        // Truncate to ~200 characters
                        readmeText = cleanedReadme.length > 200
                            ? cleanedReadme.substring(0, 200).trim() + '...'
                            : cleanedReadme;
                    }
                } catch (readmeError) {
                    console.log('No README available for', name);
                }

                const displayText = readmeText || description;

                githubContent.innerHTML = `
                    <a href="${url}" target="_blank" class="latest-link">
                        <div class="latest-info">
                            <h4><i class="fas fa-code-branch"></i> ${name}</h4>
                            <p class="latest-description">${displayText}</p>
                            <div class="latest-meta">
                                ${language !== 'Unknown' ? `<span class="latest-language"><i class="fas fa-circle"></i> ${language}</span>` : ''}
                                <span class="latest-stars"><i class="fas fa-star"></i> ${stars}</span>
                                <span class="latest-date"><i class="fas fa-clock"></i> ${timeAgo}</span>
                            </div>
                        </div>
                    </a>
                `;
            } else {
                githubContent.innerHTML = '<div class="latest-error">No repositories found</div>';
            }
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            githubContent.innerHTML = '<div class="latest-error">Failed to load repository</div>';
        }
    }

    // Helper function to format time ago
    function getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';

        return Math.floor(seconds) + ' second' + (Math.floor(seconds) > 1 ? 's' : '') + ' ago';
    }

    // Fetch latest content if section exists
    if (document.getElementById('latest')) {
        fetchLatestYouTube();
        fetchLatestGitHub();
    }
});
