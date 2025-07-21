# SenseiIWyze Dashboard

A modern, responsive login dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Secure Authentication**: Email/password login with form validation
- 🌐 **Social Login**: Google, Facebook, and GitHub integration
- 📱 **Responsive Design**: Works seamlessly across all devices
- ♿ **Accessible**: WCAG compliant with proper ARIA attributes
- 🧪 **Test-Driven Development**: Comprehensive test coverage with Jest and React Testing Library
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- ⚡ **Performance**: Optimized with Next.js and TypeScript

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React
- **Deployment**: Cloudflare Workers

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   └── __tests__/         # Component tests
├── hooks/                 # Custom React hooks
│   └── __tests__/         # Hook tests
├── services/              # API services
│   └── __tests__/         # Service tests
├── utils/                 # Utility functions
│   └── __tests__/         # Utility tests
└── lib/                   # Library configurations
```

## Getting Started

1. **Install dependencies**:

```bash
npm install
```

2. **Run the development server**:

```bash
npm run dev
```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Development Approach

This project was built using **Test-Driven Development (TDD)**:

1. **Red**: Write failing tests that define expected behavior
2. **Green**: Write minimal code to make tests pass
3. **Refactor**: Improve code quality while keeping tests green

### Test Coverage

- ✅ **Unit Tests**: All utility functions and hooks
- ✅ **Integration Tests**: Component interactions and form handling
- ✅ **Edge Cases**: Error scenarios, network failures, and validation
- ✅ **Accessibility**: ARIA attributes and keyboard navigation

## Component Features

### LoginPage Component

- **Form Validation**: Real-time email and password validation
- **Loading States**: Visual feedback during authentication
- **Error Handling**: User-friendly error messages
- **Social Authentication**: Google, Facebook, and GitHub login
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive**: Mobile-first design approach

### Custom Hooks

- **useLoginForm**: Manages form state, validation, and submission

### Services

- **authService**: Handles authentication API calls with proper error handling

### Utilities

- **validation**: Email and password validation functions

## Customization

The LoginPage component accepts various props for customization:

```typescript
<LoginPage
  heading="Welcome Back"
  logo={{
    url: "https://yoursite.com",
    src: "/your-logo.svg",
    alt: "Your Logo"
  }}
  onLogin={handleLogin}
  onSocialLogin={handleSocialLogin}
/>
```

## Deployment

### Cloudflare Workers

```bash
npm run build && npm run deploy
```

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Vercel
- Netlify
- AWS Amplify
- Railway
- Render

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Write tests for your changes
4. Implement your feature
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [shadcn/ui](https://ui.shadcn.com/) for the component design system