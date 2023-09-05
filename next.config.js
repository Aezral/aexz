/** @type {import('next').NextConfig} */
const nextConfig = {
    // modularizeImports: {
    //     "react-icons": {
    //         transform:
    //     }
    // }
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          },
        ],
      },
    
}

module.exports = nextConfig
