# arneman.me

Personal portfolio website by me, [Mark Arneman](https://arneman.me). 

A minimal single-page with a dark Gruvbox theme. 

Built with [Hugo](https://gohugo.io/) and deployed via Docker on [CapRover](https://caprover.com/)

## Links

- **My Porfolio**: [arneman.me](https://arneman.me)
- **Status Page**: [status.arneman.me](https://status.arneman.me)
- **My Games**: [bearlikelion.com](https://bearlikelion.com)
- **LinkedIn**: [linkedin.com/in/markarneman](https://www.linkedin.com/in/markarneman/)
- **Bluesky**: [bsky.app/profile/bearlikelion.com](https://bsky.app/profile/bearlikelion.com)
- **X (Twitter)**: [x.com/bearlikelion](https://x.com/bearlikelion)

## Tech Stack

- **[Hugo](https://gohugo.io/)** - Static site generator
- **[CapRover](https://caprover.com/)** - Container deployment platform
- **Docker** - Multi-stage build (Hugo build → Nginx serve)
- **[Font Awesome](https://fontawesome.com/)** - Icon library

## Color Palette

The site uses a dark [Gruvbox](https://github.com/morhetz/gruvbox) color scheme:

- **Background**: `#282828`
- **Cards**: `#3c3836`
- **Accent**: `#fabd2f`
- **Text**: `#ebdbb2`
- **Borders**: `#504945`

## Project Structure

```
arneman.me/
├── themes/arneman/
│   ├── layouts/
│   │   |── partials/       # Reusable components
│   │   |── 404.html        # Custom error page
│   │   └── index.html      # Main single-page layout
│   └── static/
│       ├── css/            # Gruvbox theme styles
│       ├── js/             # Navigation and animations
│       └── images/         # Avatar and favicon
├── captain-defition        # Caprover deployment script
├── Dockerfile              # Multi-stage build config
└── uptime-kuma-gruvbox.css # Custom status page theme
```

## Development

### Prerequisites
- [Hugo](https://gohugo.io/)
- [Git](https://git-scm.com/)

### Running Locally

```bash
# Clone the repository
git clone https://github.com/bearlikelion/arneman.me.git
cd arneman.me

# Start Hugo development server
hugo serve

# Or use VS Code launch configuration
# Press F5 or use Run > Start Debugging
```

The site will be available at `http://localhost:1313`

## Status Page Theme

A matching Gruvbox theme for Uptime Kuma is included in `uptime-kuma-gruvbox.css`.

View the themed status page at [https://status.arneman.me/](https://status.arneman.me/)

## License

[MIT License](./LICENSE)