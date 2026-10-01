import { config } from "dotenv";
config({ path: ".env.local" });
import { db } from "./src/db";
import { projects } from "./src/db/schema";
import { count } from "drizzle-orm";

const fallbackProjects = [
  {
    slug: "infrastructure-as-code",
    title: "Infrastructure as Code Pipeline",
    description: "Robust, automated infrastructure provisioning using Terraform. Deploys containerized workloads to AWS via GitHub Actions with secure state management and automated compliance testing.",
    techStack: ["Terraform", "GitHub Actions", "AWS", "Bash", "Docker"],
    repoUrl: "https://github.com/ShalinTimalsina/Terraform_CI-CD",
    featured: true,
    publishedAt: new Date(),
  },
  {
    slug: "terraform-aws-architecture",
    title: "AWS Global Architecture with Terraform",
    description: "Highly available AWS infrastructure deployed entirely via Terraform. Features Route 53 DNS routing, ACM SSL certificates, CloudFront CDN, Auto Scaling Groups (ASG), Application Load Balancers (ALB), and secure S3 storage.",
    techStack: ["Terraform", "AWS", "Route 53", "ACM", "CloudFront", "ASG", "ALB", "S3"],
    repoUrl: "https://github.com/ShalinTimalsina/Terraform_Projects",
    featured: true,
    publishedAt: new Date(),
  },
  {
    slug: "docker-nodejs-ci-cd",
    title: "Docker Node.js CI/CD Pipeline",
    description: "Production-Style Dockerized Node.js app behind Nginx reverse proxy with HTTPS via Let’s Encrypt and automated Certbot renewal, deployed using Docker Compose for scalable cloud infrastructure. CI/CD pipeline via GitHub Actions for testing, security scans, SonarQube quality gates, Docker image build & push, and SSH-based automated deployment.",
    techStack: ["Docker", "Node.js", "Nginx", "GitHub Actions", "SonarQube"],
    repoUrl: "https://github.com/ShalinTimalsina/Docker-Nodejs-CI-CD",
    featured: true,
    publishedAt: new Date(),
  },
  {
    slug: "techspire-attendance",
    title: "Techspire Attendance System",
    description: "Enterprise-grade automated attendance tracking system deployed in a containerized environment with reverse proxy configurations and continuous integration.",
    techStack: ["React", "FastAPI", "PostgreSQL", "Docker", "Nginx", "Caddy", "GitHub Actions"],
    repoUrl: "https://github.com/Techspire-Attendance-System/Attendance-System",
    featured: true,
    publishedAt: new Date(),
  },

  {
    slug: "vote-app",
    title: "Vote App",
    description: "Real-time voting application with a microservices backend, deployed on Kubernetes.",
    techStack: ["TypeScript", "Docker", "Kubernetes", "Redis"],
    repoUrl: "https://github.com/ShalinTimalsina/Vote-app",
    featured: true,
    publishedAt: new Date(),
  },
  {
    slug: "cloudway-lms",
    title: "Cloudway LMS",
    description: "Comprehensive Learning Management System built for scale and high concurrency.",
    techStack: [".NET", "C#", "PostgreSQL"],
    repoUrl: "https://github.com/ShalinTimalsina/Cloudway_LMS",
    featured: true,
    publishedAt: new Date(),
  }
];

async function seed() {
  console.log("Clearing existing projects...");
  await db.delete(projects);
  console.log("Seeding updated projects...");
  await db.insert(projects).values(fallbackProjects);
  console.log(`Seeded ${fallbackProjects.length} projects successfully!`);
}

seed().catch(console.error).finally(() => process.exit(0));
