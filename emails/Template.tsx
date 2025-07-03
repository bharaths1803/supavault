import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export default function EmailTemplate({
  username = "Bharath",
  otp = "123456",
}: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>SupaVault's OTP Verification</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.title}>SupaVault's OTP Verification</Heading>
          <Text style={styles.text}>Hey {username}! 👋</Text>
          <Text style={styles.text}>
            Here’s your one-time password (OTP) to unlock the next step in your
            adventure:
          </Text>
          <Text style={styles.heading}>🎉 OTP: {otp} 🎉</Text>
          <Text style={styles.text}>
            This magical code expires in 10 minutes, so use it before it
            vanishes like a ninja in the night! 🕒💨
          </Text>
          <Text style={styles.text}>
            If you didn’t request this, no worries — just ignore this email (and
            maybe do a little dance for extra security 🕺💃).
          </Text>
          <Text style={styles.text}>Stay awesome,</Text>
          <Text style={styles.heading}>The SupaVault Crew 🛸</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};
