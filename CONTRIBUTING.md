# Contributing to LogForge

Thank you for considering contributing to LogForge!

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test your changes** (`npm run dev`)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Anthropic API key to .env.local
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Start development server
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Run `npm run lint` before committing
- Keep components small and focused

## Adding New Language Support

To add support for a new programming language:

1. Add the language to `LANGUAGES` array in `src/components/quick/TransformPanel.tsx`
2. Add example code to `EXAMPLE_CODE` object
3. Update file extension mapping in `handleDownload` function
4. Test the transformation

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Add tests if applicable
- Ensure all CI checks pass

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
