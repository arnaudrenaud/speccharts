class Speccharts < Formula
  desc "Generate diagrams from test suites to reveal application specs"
  homepage "https://github.com/arnaudrenaud/speccharts"
  url "https://registry.npmjs.org/speccharts/-/speccharts-0.4.1.tgz"
  sha256 "403d1ea0def31a465cf26f25c9bbf1e1767c830f6c4fb031cd5721ed0ba9f866"
  license "ISC"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/speccharts", "--help"
  end
end
