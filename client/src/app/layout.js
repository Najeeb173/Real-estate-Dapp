import "./globals.css";
import { Web3Provider } from "../context/web3Context";  // ✅ NOW WORKS!

export const metadata = {
  title: "Real Estate Marketplace",
  description: "Blockchain based real estate DApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
