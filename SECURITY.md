# Security Policy

## 1. Security Commitment
At MedVision AI, we take the security and integrity of our codebase seriously. As an open-source medical AI platform, ensuring that our infrastructure, dependencies, and algorithms remain secure is a top priority. We deeply appreciate the efforts of the security research community in helping us maintain a secure environment through responsible vulnerability disclosure.

## 2. Supported Versions

Currently, only the latest major release of MedVision AI is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 3. Reporting a Vulnerability

If you discover a security vulnerability within this project, please **DO NOT** open a public issue, pull request, or discuss it in public channels (including social media).

**Preferred Reporting Method:**
Please report vulnerabilities privately using [GitHub Private Vulnerability Reporting](https://github.com/vikassaini77/healthcare-recommendation-system/security/advisories/new) if available, or by emailing the security contact at `[SECURITY_EMAIL]`.

### Information to Include
To help us triage and resolve the issue quickly, please include the following in your report:
* **Vulnerability type:** (e.g., XSS, SQLi, RCE, insecure deserialization)
* **Affected version:** (e.g., v1.0.x)
* **Affected component:** (e.g., FastAPI backend, React frontend)
* **Reproduction steps:** Clear, step-by-step instructions.
* **Expected vs. Actual behavior.**
* **Potential impact:** How this vulnerability could be exploited.
* **Proof of Concept (PoC):** When safe to provide.
* **Suggested remediation:** If known.

*Note: Please redact or remove any sensitive personal information or secrets from logs and screenshots.*

## 4. What Happens After a Report

When you submit a vulnerability report, our team follows a structured response workflow:
1. **Acknowledgement:** We aim to acknowledge receipt of your report within 48 hours.
2. **Validation and Triage:** We will verify the vulnerability and determine its scope.
3. **Severity Assessment:** We will classify the risk (Critical, High, Medium, Low) using standard frameworks.
4. **Investigation & Remediation:** We will develop and test a patch.
5. **Release:** A security update will be published.
6. **Disclosure & Advisory:** We will publish a GitHub Security Advisory (and CVE if appropriate), acknowledging your responsible disclosure.

## 5. Security Severity

We generally classify vulnerabilities based on standard risk frameworks into the following categories:
* **Critical:** Vulnerabilities causing total system compromise, remote code execution (RCE), or massive data exposure without authentication.
* **High:** Significant risk of data exposure or privilege escalation requiring specific conditions.
* **Medium:** Vulnerabilities requiring significant user interaction or yielding limited impact.
* **Low:** Theoretical issues or those requiring highly unlikely circumstances to exploit.

## 6. Responsible Disclosure & Safe Harbor

We encourage good-faith security research and ask that you adhere to these guidelines:
* **Give us reasonable time:** Please allow us time to investigate and patch the vulnerability before disclosing it publicly.
* **Do no harm:** Avoid accessing, modifying, or deleting data that does not belong to you. Do not disrupt services or execute destructive testing.
* **Act in good faith:** Stop testing once you have sufficient evidence of a vulnerability. Do not use exploits for data exfiltration.

## 7. Security Best Practices for Contributors

If you are contributing to MedVision AI, please adhere to these security standards:
* **Never commit secrets:** Passwords, API keys, access tokens, and private keys (e.g., `GEMINI_API_KEY`) must never be hardcoded or committed to version control. Use environment variables.
* **Accidental Commits:** If you accidentally commit a secret, **do not just delete it in a new commit**. Git history retains all past commits. You must rotate/revoke the compromised credential immediately.
* **Validate input:** Ensure all untrusted input is strictly validated using Pydantic models.
* **Keep dependencies updated:** Regularly run `npm audit` and check Python package advisories.
* **Least privilege:** Ensure IAM roles and cloud permissions follow the principle of least privilege.

## 8. Third-Party Dependencies

Modern applications rely on open-source dependencies which can occasionally introduce security risks. We proactively monitor security advisories for our React and FastAPI stacks and will issue patch releases when critical upstream vulnerabilities are identified.

## 9. Scope

**In Scope:**
* The core MedVision AI codebase (backend APIs and frontend UI).
* Authentication flows and data handling within the application.

**Out of Scope:**
* General bugs, feature requests, or performance complaints.
* Third-party services or infrastructure not directly managed by this repository.
* Denial-of-Service (DoS) testing or social engineering against project maintainers.

## 10. Acknowledgements

We are incredibly grateful to security researchers who report issues responsibly. Researchers who help us resolve confirmed security vulnerabilities will be recognized in our Security Advisories and release notes.

## 11. Contact

For all security-related inquiries, please contact: `[SECURITY_EMAIL]`
