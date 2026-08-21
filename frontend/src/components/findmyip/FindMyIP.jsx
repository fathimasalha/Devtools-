import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FindMyIP.css';
import { motion } from 'framer-motion';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAHxk_XmcsLaJ60WeDm3PrtBpK0PZ766Tw';

const FindMyIP = () => {
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8000/api/ipinfo/');
        setIpInfo(response.data);
      } catch (err) {
        setError('Failed to fetch IP information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchIpInfo();
  }, []);

  const handleMapError = () => {
    setMapError(true);
  };

  if (loading) {
    return (
      <div className="findmyip-flex-center">
        <div className="findmyip-spinner"></div>
        <div className="findmyip-title">Loading IP information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="findmyip-flex-center">
        <div className="findmyip-error"><i className="fas fa-exclamation-triangle mr-2" />{error}</div>
        <button
          className="findmyip-card-refresh"
          onClick={() => window.location.reload()}
        >
          <i className="fas fa-sync-alt mr-2" />Retry
        </button>
      </div>
    );
  }

  return (
    <div className={"findmyip-root findmyip-fadein-up"}>
      <h1 className="findmyip-title">FindMyIP</h1>
      <div className="findmyip-subtitle">Reveal your digital identity and network details</div>
      <div className="findmyip-grid">
        {/* IP Information Card */}
        <motion.div
          className="findmyip-card"
          whileHover={{ scale: 1.03, boxShadow: '0 4px 32px 0 rgba(102,126,234,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="findmyip-card-header">
            <div className="findmyip-card-icon">
              <i className="fas fa-server text-white text-xl" />
            </div>
            <h3 className="findmyip-card-title">IP Information</h3>
            <button
              className="findmyip-card-refresh"
              onClick={() => window.location.reload()}
              title="Refresh"
            >
              <i className="fas fa-sync-alt" />
            </button>
          </div>
          {ipInfo && (
            <div className="findmyip-info-list">
              {[
                { label: 'IPv4 Address', value: ipInfo.ip },
                { label: 'IPv6 Address', value: ipInfo.ipv6 || 'Not Detected' },
                { label: 'Location', value: [ipInfo.city, ipInfo.region, ipInfo.country].filter(Boolean).join(', ') || 'N/A' },
                { label: 'ISP', value: ipInfo.org || 'N/A' },
                { label: 'ASN', value: (ipInfo.asn || 'N/A').toString().split(' ')[0] },
                { label: 'Timezone', value: ipInfo.timezone || 'N/A' },
                { label: 'Postal Code', value: ipInfo.postal || 'N/A' },
              ].map((row, idx) => (
                <motion.div
                  className="findmyip-info-row"
                  key={row.label}
                  whileHover={{ backgroundColor: 'rgba(102,126,234,0.08)' }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="findmyip-info-label">{row.label}</span>
                  <span className="findmyip-info-value">{row.value}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        {/* Map Card */}
        <motion.div
          className="findmyip-map-card"
          whileHover={{ scale: 1.03, boxShadow: '0 4px 32px 0 rgba(102,126,234,0.18)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="findmyip-card-header">
            <div className="findmyip-card-icon">
              <i className="fas fa-map-marker-alt text-white text-xl" />
            </div>
            <h3 className="findmyip-card-title">Location Map</h3>
          </div>
          <div className="findmyip-map">
            {ipInfo && ipInfo.latitude && ipInfo.longitude && !mapError ? (
              <>
                <iframe
                  title="location-map"
                  width="100%"
                  height="350"
                  frameBorder="0"
                  className="findmyip-map-iframe"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${ipInfo.latitude},${ipInfo.longitude}&zoom=12`}
                  allowFullScreen
                  onError={handleMapError}
                />
                {ipInfo && (ipInfo.city || ipInfo.country) && (
                  <div className="findmyip-map-label">
                    <i className="fas fa-map-pin" />
                    {`${ipInfo.city || ''}${ipInfo.city && ipInfo.country ? ', ' : ''}${ipInfo.country || ''}`}
                  </div>
                )}
              </>
            ) : (
              <div className="findmyip-map-error">
                <i className="fas fa-map-marker-alt text-3xl mb-2" />
                {mapError ? (
                  <p>Unable to load map. Please check your Google Maps API key.</p>
                ) : (
                  <p>Location data not available for map display.</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {/* BEGIN: IP Educational Content Section */}
      <section className="wmiip-dark">
        
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon" style={{fontSize: '2.3rem'}}>🌐</span>
            <h2>FindMyIP</h2>
          </div>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">💡</span>
            <h3>1. What Is an IP Address?</h3>
          </div>
          <p>An Internet Protocol (IP) address is a unique identifier assigned to every device connected to a network. Think of it like your home's mailing address: it tells other devices where to send data.</p>
          <div className="bold">Why it matters:</div>
          <ul>
            <li><span className="blue">Routing:</span> Routers use IPs to forward packets to the right destination.</li>
            <li><span className="blue">Identification:</span> Servers log incoming IPs for analytics, security, and personalization.</li>
          </ul>
        </div>
        <div className="wmiip-dark-card ipv-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🔄</span>
            <h3>2. IPv4 vs. IPv6: The Two Generations of IP</h3>
          </div>
          <table className="wmiip-dark-table">
            <thead>
              <tr><th>Feature</th><th>IPv4</th><th>IPv6</th></tr>
            </thead>
            <tbody>
              <tr><td>Address length</td><td>32 bits (e.g. <code>192.0.2.1</code>)</td><td>128 bits (e.g. <code>2001:0db8:85a3::8a2e:0370:7334</code>)</td></tr>
              <tr><td>Maximum addresses</td><td>~4.3 billion</td><td>~340 undecillion (<code>3.4×10<sup>38</sup></code>)</td></tr>
              <tr><td>Notation</td><td>Dotted-decimal (four octets)</td><td>Hexadecimal, colon-separated (eight groups)</td></tr>
              <tr><td>Header complexity</td><td>Simple</td><td>Simplified yet extensible</td></tr>
              <tr><td>Auto-configuration</td><td>Optional (DHCP)</td><td>Built-in (Stateless Address Autoconfig)</td></tr>
              <tr><td>Invented / Standard</td><td>Early 1970s, RFC 791 (1981)</td><td>Late 1990s, RFC 2460 (1998)</td></tr>
              <tr><td>Example</td><td><a href="#" className="blue">203.0.113.45</a></td><td><a href="#" className="blue">2401:db00:2110:3001:face:b00c:0:1</a></td></tr>
            </tbody>
          </table>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🕰️</span>
            <h3>3. A Brief History: Who Invented IP?</h3>
          </div>
          <ul>
            <li><span className="blue">Origins:</span> The IP protocol arose from the ARPANET research in the late 1960s.</li>
            <li><span className="blue">Key Figures:</span> Vint Cerf & Bob Kahn defined the core TCP/IP architecture in 1974. Jon Postel maintained early RFCs and steered IANA allocations.</li>
            <li><span className="blue">Standards:</span> IPv4 was codified in RFC 791 (1981). IPv6 followed in RFC 2460 (1998) to address IPv4 exhaustion.</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🗂️</span>
            <h3>4. Different Types of IP Addresses</h3>
          </div>
          <div className="bold">Public vs. Private:</div>
          <ul>
            <li><span className="blue">Public IP:</span> Routable on the internet (e.g., <code>8.8.8.8</code>).</li>
            <li><span className="blue">Private IP:</span> Used within local networks (e.g., <code>192.168.0.0/16</code>, <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>).</li>
          </ul>
          <div className="bold">Static vs Dynamic:</div>
          <ul>
            <li><span className="blue">Static IP:</span> Permanently assigned to a device or server. Example: <code>203.0.113.50</code>.</li>
            <li><span className="blue">Dynamic IP:</span> Temporarily assigned by DHCP each time a device connects. Example: Your home router’s WAN IP may shift from <code>198.51.100.2</code> to <code>198.51.100.87</code> every few days.</li>
          </ul>
          <div className="bold">Reserved IP Ranges:</div>
          <ul>
            <li><span className="blue">Loopback:</span> <code>127.0.0.1</code> (your own machine).</li>
            <li><span className="blue">Link-Local:</span> <code>169.254.0.0/16</code> (automatic addressing when DHCP fails).</li>
            <li><span className="blue">Multicast:</span> <code>224.0.0.0/4</code> (one-to-many delivery).</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">⚖️</span>
            <h3>5. Static IP vs. Dynamic IP: When & Why</h3>
          </div>
          <table className="wmiip-dark-table">
            <thead>
              <tr><th>Aspect</th><th>Static IP</th><th>Dynamic IP</th></tr>
            </thead>
            <tbody>
              <tr><td>Assignment</td><td>Manually set by network admin</td><td>Automatically via DHCP</td></tr>
              <tr><td>Change frequency</td><td>Rarely (remains constant)</td><td>Can change on reboot or lease renewal</td></tr>
              <tr><td>Use cases</td><td>Web servers, VPN endpoints, VOIP systems</td><td>Residential internet, mobile devices</td></tr>
              <tr><td>Cost</td><td>Often higher (ISP fee for static)</td><td>Usually included in standard service plans</td></tr>
              <tr><td>Example</td><td><a href="#" className="blue">198.51.100.35 (static website hosting)</a></td><td><a href="#" className="blue">198.51.100.102 today, 198.51.100.117 tomorrow</a></td></tr>
            </tbody>
          </table>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🔢</span>
            <h3>6. Decoding the "Dots" in an IPv4 Address</h3>
          </div>
          <p>An IPv4 address like <a href="#" className="blue">192.168.1.10</a> has four octets separated by dots:</p>
          <ul>
            <li><span className="blue">Octet 1 (192):</span> Network portion</li>
            <li><span className="blue">Octet 2 (168):</span> Sub-network portion</li>
            <li><span className="blue">Octet 3 (1):</span> Further subdivision</li>
            <li><span className="blue">Octet 4 (10):</span> Host identifier</li>
          </ul>
          <p>Each octet ranges from 0 to 255 (<code>2^8</code> values). In binary, 192.168.1.10 is: <code>11000000 . 10101000 . 00000001 . 00001010</code></p>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🛡️</span>
            <h3>7. What Is a Proxy & How It Works</h3>
          </div>
          <p>A proxy server sits between your device and the internet:</p>
          <div style={{background:'#181a1b',color:'#3b82f6',padding:'10px 0',textAlign:'center',fontWeight:'600',fontSize:'1.1rem',borderRadius:'6px',marginBottom:'10px'}}>[You] ⇄ [Proxy] ⇄ [Target Server]</div>
          <div className="bold">Types:</div>
          <ul>
            <li><span className="blue">Forward Proxy:</span> Hides clients from servers</li>
            <li><span className="blue">Reverse Proxy:</span> Hides servers from clients (e.g. load balancers)</li>
          </ul>
          <div className="bold">How it works:</div>
          <ol>
            <li>Your browser sends a request to the proxy</li>
            <li>Proxy forwards the request using its own IP</li>
            <li>Target server responds to the proxy</li>
            <li>Proxy relays data back to your browser</li>
          </ol>
          <div className="bold">Example:</div>
          <p>Using a U.S. proxy at <a href="#" className="blue">34.203.129.235</a> makes it appear you're browsing from New York even if you're in Mumbai.</p>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">⚡</span>
            <h3>8. Proxy Advantages & Disadvantages</h3>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'32px'}}>
            <div style={{flex:'1 1 300px'}}>
              <div className="bold">👍 Advantages:</div>
              <ul>
                <li><span className="blue">Privacy:</span> Masks your real IP</li>
                <li><span className="blue">Geo-spoofing:</span> Access region-restricted content</li>
                <li><span className="blue">Caching:</span> Speeds up repeat requests</li>
                <li><span className="blue">Filtering:</span> Blocks malicious sites or ads</li>
              </ul>
            </div>
            <div style={{flex:'1 1 300px'}}>
              <div className="red bold"> 👎 Disadvantages:</div>
              <ul>
                <li><span className="blue">Latency:</span> Adds an extra network hop</li>
                <li><span className="blue">Trust:</span> Proxy operator can log your traffic</li>
                <li><span className="blue">Complexity:</span> Requires configuration for HTTPS, SOCKS, etc.</li>
                <li><span className="blue">Reliability:</span> Free proxies often go offline or throttle bandwidth</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🔬</span>
            <h3>9. IPv4 vs. IPv6: A Deeper Comparison</h3>
          </div>
          <table className="wmiip-dark-table">
            <thead>
              <tr><th>Criteria</th><th>IPv4</th><th>IPv6</th></tr>
            </thead>
            <tbody>
              <tr><td>Address space</td><td>4.3 billion addresses</td><td>3.4×10<sup>38</sup> addresses</td></tr>
              <tr><td>Header overhead</td><td>20 bytes</td><td>40 bytes (more fields but simplified routing)</td></tr>
              <tr><td>NAT requirement</td><td>Widespread NAT to conserve addresses</td><td>End-to-end connectivity without NAT</td></tr>
              <tr><td>Security</td><td>Optional (IPsec add-on)</td><td>IPsec support mandated in spec</td></tr>
              <tr><td>Deployment status</td><td>Universally supported</td><td>Growing adoption (major OS & devices today)</td></tr>
            </tbody>
          </table>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🔗</span>
            <h3>10. Putting It All Together</h3>
          </div>
          <p>Your IP address is more than a string of numbers—it's the backbone of internet communication, security, and personalization. At DevToolz IP Info, we:</p>
          <ul>
            <li>Automatically detect your public IPv4 or IPv6 address</li>
            <li>Show ISP & geolocation details without logging your data</li>
            <li>Offer a JSON API for developers (no API key needed)</li>
            <li>Explain every field so you understand your network footprint</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">⭐</span>
            <h3>Check Your IP Address Instantly with DevToolz IP Info</h3>
          </div>
          <p>Looking for a free IP lookup tool? Want to check your IP address and IP geolocation in seconds? <span className="blue bold">DevToolz IP Info</span> is your go-to IP address checker—no signup, no ads, no limits.</p>
          <div className="bold">Primary Keywords:</div>
          <ul>
            <li>check my IP</li>
            <li>IP lookup tool</li>
            <li>public IP address</li>
            <li>IP geolocation lookup</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🔍</span>
            <h3>Why Use Our IP Lookup Tool?</h3>
          </div>
          <ol>
            <li><span className="bold">Fast & Accurate IP Address Detection</span>
              <ul>
                <li>Instant display of your public IPv4 or IPv6 address</li>
                <li>Zero delays—results load as soon as you land on the page</li>
              </ul>
            </li>
            <li><span className="bold">In-Depth Geolocation Data</span>
              <ul>
                <li>City, region, country, and postal code</li>
                <li>Latitude & longitude for precise mapping</li>
                <li>Timezone and local time offset</li>
              </ul>
            </li>
            <li><span className="bold">Developer-Friendly JSON API</span>
              <ul>
                <li>Hit <a href="https://devtoolz.tech/ipinfo/json" className="blue" target="_blank" rel="noopener noreferrer">https://devtoolz.tech/ipinfo/json</a> for live JSON output</li>
                <li>No API key required—perfect for integrating into your apps</li>
              </ul>
            </li>
            <li><span className="bold">Privacy-First Policy</span>
              <ul>
                <li>We don’t log or store your IP—view with total peace of mind</li>
              </ul>
            </li>
          </ol>
          <div className="bold">Long-tail Keywords:</div>
          <ul>
            <li>free IP lookup tool</li>
            <li>how to find my IP</li>
            <li>IP geolocation API</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🚀</span>
            <h3>Common Use Cases for IP Address Lookup</h3>
          </div>
          <ul>
            <li><span className="bold">Network Troubleshooting:</span> Verify your external IP when diagnosing connectivity or firewall issues.</li>
            <li><span className="bold">Online Privacy Checks:</span> Confirm if your VPN or proxy is masking your real IP address.</li>
            <li><span className="bold">Content Personalization:</span> Deliver region-based pricing, language, or service options based on visitor location.</li>
            <li><span className="bold">Security & Compliance:</span> Record accurate IPs for audit trails, intrusion detection, and log analysis.</li>
            <li><span className="bold">Web Development & Testing:</span> Automate IP checks in CI/CD pipelines or test geo-specific features.</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">📈</span>
            <h3>Boost Your SEO with IP-Based Personalization</h3>
          </div>
          <p>Modern sites leverage IP geolocation to tailor content and improve user engagement—both positive ranking signals. With DevToolz IP Info:</p>
          <ul>
            <li>Detect visitor location in real time.</li>
            <li>Serve localized landing pages or currency conversions.</li>
            <li>Reduce bounce rate by showing relevant regional offers.</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🛠️</span>
            <h3>How to Use DevToolz IP Info</h3>
          </div>
          <ol>
            <li><span className="bold"> 1. Open the Page</span><br />Simply navigate to <code>/ipinfo</code>—no registration.</li>
            <li><span className="bold"> 2. View Your IP & Geodata</span><br />All fields auto-populate: IP, ISP, Country, City, Timezone, ASN, and more.</li>
            <li><span className="bold"> 3. Copy or Share</span><br />Click the copy icon next to any value to share over email or include in reports.</li>
            <li><span className="bold"> 4. Bookmark for Quick Access</span><br />Return anytime to check changes in your network environment.</li>
          </ol>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">🧠</span>
            <h3>Advanced Tips for Power Users</h3>
          </div>
          <ul>
            <li><span className="bold">Bulk IP Checks:</span> Script against our JSON endpoint to verify multiple IPs in batch.</li>
            <li><span className="bold">Geo-Targeting in Analytics:</span> Export IP data to Google Analytics for deeper traffic segmentation.</li>
            <li><span className="bold">Automated Alerts:</span> Integrate with monitoring tools (e.g., Grafana, Datadog) to trigger notifications when your public IP changes.</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">❓</span>
            <h3>Frequently Asked Questions (FAQ)</h3>
          </div>
          <ul className="faq-list">
            <li><span className="bold">Q1. How do I find my IP address?</span><br />Visit this page—your public IP appears instantly at the top.</li>
            <li><span className="bold">Q2. Is it safe to expose my IP?</span><br />Your public IP is visible to any website you visit. Use a VPN or proxy for extra privacy.</li>
            <li><span className="bold">Q3. Why is my IPv6 different?</span><br />IPv6 uses a longer, hexadecimal format (128-bit) to provide a vastly larger address space.</li>
            <li><span className="bold">Q4. Can I use your IP API commercially?</span><br />Yes—our JSON API is free for personal and commercial use without rate limits.</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="wmiip-card-heading-row">
            <span className="wmiip-card-icon">📣</span>
            <h3>Call to Action: Get Started Now!</h3>
          </div>
          <ul>
            <li>Don’t wait! Bookmark DevToolz IP Info today and keep your network insights at your fingertips.</li>
            <li>Share this tool on social media, add it to your blog as a helpful resource, or integrate our IP geolocation API into your next project—boost user trust, engagement, and SEO performance.</li>
          </ul>
        </div>
        <div className="wmiip-dark-card">
          <div className="bold">Internal Linking Suggestions:</div>
          <ul>
            <li>Link to your blog post on “Understanding IPv4 vs. IPv6”</li>
            <li>Link to your tutorial on “Setting Up a VPN on Linux”</li>
            <li>Link to your guide on “How to Configure DHCP on Your Router”</li>
          </ul>
          <div className="bold">Image ALT Text Ideas:</div>
          <ul>
            <li>DevToolz IP Info dashboard showing public IP and geolocation</li>
            <li>Example of IPv4 address lookup on DevToolz</li>
            <li>Developer using IP geolocation API in code editor</li>
          </ul>
        </div>
      </section>
      {/* END: IP Educational Content Section (Lovable App Style) */}
    </div>
  );
};

export default FindMyIP; 