import { CommandDefinition } from "../types"

export const dockerCmd: CommandDefinition = {
  name: "docker",
  description: "Docker image and container management",
  usage: "docker [ps|images|run|build]",
  run: (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("Usage: docker [OPTIONS] COMMAND\n\nCommands:\n  ps          List containers\n  images      List images\n  version     Show the Docker version information\n\nRun 'docker COMMAND --help' for more information on a command.")
      return 1
    }

    const sub = args[1]
    if (sub === "--help" || sub === "-h" || sub === "help") {
      io.write("Usage:  docker [OPTIONS] COMMAND\n\nA self-sufficient runtime for containers\n\nOptions:\n      --config string      Location of client config files (default \"/home/shalin/.docker\")\n  -D, --debug              Enable debug mode\n  -H, --host list          Daemon socket(s) to connect to\n  -l, --log-level string   Set the logging level (debug|info|warn|error|fatal) (default \"info\")\n  -v, --version            Print version information and quit\n\nCommands:\n  ps          List containers\n  images      List images")
      return 0
    }
    
    if (sub === "--version" || sub === "-v" || sub === "version") {
      io.write("Docker version 24.0.5, build ced0996")
      return 0
    }

    if (sub === "ps") {
      io.write({
        type: "table",
        content: [
          [{ type: "bold", color: "text-foreground", content: "CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS          PORTS                                       NAMES" }],
          [{ type: "text", content: "e8d4a9b2f1c0   postgres:15-alpine     \"docker-entrypoint.s…\"   2 days ago       Up 2 days       0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   shalin-db" }],
          [{ type: "text", content: "7c3b9d1e4a5f   redis:7-alpine         \"docker-entrypoint.s…\"   2 days ago       Up 2 days       0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   shalin-cache" }],
          [{ type: "text", content: "a1b2c3d4e5f6   portfolio-web:latest   \"npm start\"              25 minutes ago   Up 25 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   shalin-web" }]
        ] as any
      })
    } else if (sub === "images") {
      io.write({
        type: "table",
        content: [
          [{ type: "bold", color: "text-foreground", content: "REPOSITORY             TAG          IMAGE ID       CREATED          SIZE" }],
          [{ type: "text", content: "portfolio-web          latest       1a2b3c4d5e6f   25 minutes ago   142MB" }],
          [{ type: "text", content: "postgres               15-alpine    e8d4a9b2f1c0   2 weeks ago      243MB" }],
          [{ type: "text", content: "redis                  7-alpine     7c3b9d1e4a5f   3 weeks ago      117MB" }]
        ] as any
      })
    } else {
      io.writeError(`docker: '${sub}' is not a valid mock command for this terminal. Try 'ps' or 'images'.`)
      return 1
    }
    return 0
  }
}

export const kubectlCmd: CommandDefinition = {
  name: "kubectl",
  aliases: ["k"],
  description: "Kubernetes cluster manager",
  usage: "kubectl [get|describe|logs]",
  run: (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("kubectl controls the Kubernetes cluster manager.\n\nUsage:\n  kubectl [flags] [options]\n\nBasic Commands:\n  get           Display one or many resources\n  describe      Show details of a specific resource or group of resources\n  logs          Print the logs for a container in a pod\n\nUse \"kubectl <command> --help\" for more information about a given command.")
      return 1
    }

    const sub = args[1]
    if (sub === "--help" || sub === "-h" || sub === "help") {
      io.write("kubectl controls the Kubernetes cluster manager.\n\nUsage:\n  kubectl [flags] [options]\n\nBasic Commands:\n  get           Display one or many resources\n  describe      Show details of a specific resource or group of resources\n  logs          Print the logs for a container in a pod\n\nOptions:\n  -h, --help=false: help for kubectl\n      --version=false: Print version information and quit")
      return 0
    }
    
    if (sub === "--version" || sub === "version") {
      io.write("Client Version: v1.27.3\nKustomize Version: v5.0.1\nServer Version: v1.27.3-eks-a5565ad")
      return 0
    }

    if (sub === "get" && args[2] === "pods") {
      io.write({
        type: "table",
        content: [
          [{ type: "bold", color: "text-foreground", content: "NAME                                READY   STATUS    RESTARTS   AGE" }],
          [{ type: "text", content: "ingress-nginx-controller-123xyz     1/1     Running   0          42d" }],
          [{ type: "text", content: "portfolio-web-deployment-987abc     1/1     Running   0          12m" }],
          [{ type: "text", content: "cert-manager-567def                 1/1     Running   0          42d" }]
        ] as any
      })
    } else if (sub === "get" && args[2] === "nodes") {
      io.write({
        type: "table",
        content: [
          [{ type: "bold", color: "text-foreground", content: "NAME                                         STATUS   ROLES    AGE   VERSION" }],
          [{ type: "text", content: "ip-10-0-1-123.us-east-1.compute.internal     Ready    <none>   42d   v1.27.3" }],
          [{ type: "text", content: "ip-10-0-2-234.us-east-1.compute.internal     Ready    <none>   42d   v1.27.3" }]
        ] as any
      })
    } else {
      io.writeError(`kubectl: cannot execute '${sub} ${args[2] || ''}'. Mock cluster only supports 'get pods' and 'get nodes'.`)
      return 1
    }
    return 0
  }
}

export const terraformCmd: CommandDefinition = {
  name: "terraform",
  aliases: ["tf"],
  description: "Terraform Infrastructure as Code",
  usage: "terraform [plan|apply]",
  run: (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("Usage: terraform [global options] <subcommand> [args]\n\nThe available mock commands for execution are listed below.\n\nMain commands:\n  plan          Show changes required by the current configuration\n  apply         Create or update infrastructure")
      return 1
    }

    const sub = args[1]
    if (sub === "--help" || sub === "-h" || sub === "help") {
      io.write("Usage: terraform [global options] <subcommand> [args]\n\nThe available mock commands for execution are listed below.\n\nMain commands:\n  plan          Show changes required by the current configuration\n  apply         Create or update infrastructure\n\nGlobal options (use these before the subcommand, if any):\n  -version      An alias for the \"version\" subcommand.")
      return 0
    }
    
    if (sub === "--version" || sub === "-version" || sub === "-v" || sub === "version") {
      io.write("Terraform v1.5.7\non linux_amd64\n+ provider registry.terraform.io/hashicorp/aws v5.17.0")
      return 0
    }

    if (sub === "plan") {
      io.write("Acquiring state lock. This may take a few moments...\n")
      setTimeout(() => {
        io.write({
          type: "color",
          color: "text-green-400 font-semibold whitespace-pre-wrap",
          content: "Terraform will perform the following actions:\n\n  # aws_instance.portfolio_server will be created\n  + resource \"aws_instance\" \"portfolio_server\" {\n      + ami           = \"ami-0c55b159cbfafe1f0\"\n      + instance_type = \"t3.micro\"\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy."
        })
      }, 800)
    } else if (sub === "apply") {
      io.write("Acquiring state lock. This may take a few moments...\n")
      setTimeout(() => {
        io.write({
          type: "color",
          color: "text-green-400 font-semibold whitespace-pre-wrap",
          content: "aws_instance.portfolio_server: Creating...\naws_instance.portfolio_server: Creation complete after 12s [id=i-0123456789abcdef0]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed."
        })
      }, 1200)
    } else {
      io.writeError(`terraform: no such mock command '${sub}'. Try 'plan'.`)
      return 1
    }
    return 0
  }
}

export const awsCmd: CommandDefinition = {
  name: "aws",
  description: "AWS Command Line Interface",
  usage: "aws [s3|ec2|iam]",
  run: (ctx, args, io) => {
    if (args.length < 2) {
      io.writeError("usage: aws [options] <command> <subcommand> [<subcommand> ...] [parameters]\nTo see help text, you can run:\n\n  aws help\n  aws <command> help\n  aws <command> <subcommand> help")
      return 1
    }
    
    const sub = args[1]
    if (sub === "--help" || sub === "help") {
      io.write("The AWS Command Line Interface is a unified tool to manage your AWS services.\n\nusage: aws [options] <command> <subcommand> [<subcommand> ...] [parameters]\nTo see help text, you can run:\n\n  aws help\n  aws <command> help\n  aws <command> <subcommand> help\n\nAVAILABLE SERVICES\n    s3\n    ec2\n    iam\n    sts")
      return 0
    }
    
    if (sub === "--version") {
      io.write("aws-cli/2.13.20 Python/3.11.5 Linux/6.2.0-33-generic exe/x86_64.ubuntu.22 prompt/off")
      return 0
    }
    
    if (args[1] === "s3" && args[2] === "ls") {
      io.write("2026-10-01 10:24:00 shalin-portfolio-tf-state\n2026-10-01 10:25:00 shalin-portfolio-assets-prod")
    } else if (args[1] === "sts" && args[2] === "get-caller-identity") {
      io.write(`{
    "UserId": "AROA1234567890ABCDEFG:session1",
    "Account": "123456789012",
    "Arn": "arn:aws:sts::123456789012:assumed-role/DevOpsRole/session1"
}`)
    } else {
      io.writeError("aws: Mock CLI supports 's3 ls' and 'sts get-caller-identity'.")
      return 1
    }
    return 0
  }
}
