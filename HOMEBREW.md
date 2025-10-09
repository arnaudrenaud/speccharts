# Homebrew Distribution Setup

This document explains how to make `speccharts` available via Homebrew for macOS users.

## Overview

The Homebrew formula for `speccharts` is provided in the `Formula/speccharts.rb` file. To make this available to users, you need to create a Homebrew tap (a Git repository containing formulas).

## Setting up a Homebrew Tap

### 1. Create a tap repository

Create a new GitHub repository named `homebrew-tap` in your account. The repository name must start with `homebrew-` for Homebrew to recognize it as a tap.

Full repository name: `arnaudrenaud/homebrew-tap`

### 2. Add the formula to the tap

Copy the `Formula/speccharts.rb` file to the root of the `homebrew-tap` repository:

```bash
# In the homebrew-tap repository
cp /path/to/speccharts/Formula/speccharts.rb speccharts.rb
git add speccharts.rb
git commit -m "Add speccharts formula"
git push
```

### 3. Users can now install via Homebrew

Once the tap is set up, users can install `speccharts` using:

```bash
# First time: add the tap
brew tap arnaudrenaud/tap

# Install speccharts
brew install speccharts
```

Or in a single command:

```bash
brew install arnaudrenaud/tap/speccharts
```

## Updating the Formula

When you release a new version of `speccharts`:

1. Download the new tarball and calculate its SHA256:
   ```bash
   curl -sL https://registry.npmjs.org/speccharts/-/speccharts-X.Y.Z.tgz | shasum -a 256
   ```

2. Update `Formula/speccharts.rb`:
   - Change the `url` to point to the new version
   - Update the `sha256` with the new hash
   - Update the version number if using a version variable

3. Copy the updated formula to the `homebrew-tap` repository and commit

4. Users can update with:
   ```bash
   brew update
   brew upgrade speccharts
   ```

## Testing the Formula Locally

Before publishing, you can test the formula locally:

```bash
# Test installation (requires Homebrew to be installed)
brew install --build-from-source Formula/speccharts.rb

# Test the audit
brew audit --strict Formula/speccharts.rb

# Test the installed package
speccharts --help

# Uninstall when done testing
brew uninstall speccharts
```

### Verifying the Formula

To verify the formula is correct without installing:

```bash
# Check Ruby syntax
ruby -c Formula/speccharts.rb

# Verify SHA256 hash
curl -sL https://registry.npmjs.org/speccharts/-/speccharts-0.4.1.tgz | shasum -a 256
```

## Alternative: Submit to homebrew-core

For widely-used packages, you can submit the formula to the official `homebrew-core` repository. However, this requires:

- The package to be notable and widely used
- Following strict homebrew-core guidelines
- Maintaining the formula according to Homebrew standards

For most projects, a personal tap (as described above) is the recommended approach.

## Formula Structure Explained

The `speccharts.rb` formula:

- **desc**: Brief description of the package
- **homepage**: Project homepage (GitHub repository)
- **url**: Direct link to the npm package tarball for the specific version
- **sha256**: SHA256 hash of the tarball (for security and integrity)
- **license**: Software license
- **depends_on "node"**: Specifies Node.js as a runtime dependency
- **install**: Installation instructions using npm
- **test**: Basic test to verify the installation works

## Resources

- [Homebrew Formula Cookbook](https://docs.brew.sh/Formula-Cookbook)
- [Homebrew Taps](https://docs.brew.sh/Taps)
- [Node.js Formulas in Homebrew](https://docs.brew.sh/Node-for-Formula-Authors)
