FROM node:18

# Install required packages
RUN apt-get update

RUN apt-get install -y ca-certificates curl gnupg git unzip wget lsb-release apt-transport-https openjdk-17-jre

# Install Docker CLI
RUN install -m 0755 -d /etc/apt/keyrings

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

RUN chmod a+r /etc/apt/keyrings/docker.gpg

RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" > /etc/apt/sources.list.d/docker.list

RUN apt-get update

RUN apt-get install -y docker-ce-cli

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip

RUN unzip awscliv2.zip

RUN ./aws/install

RUN rm -rf aws awscliv2.zip

# Install kubectl
RUN curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl

RUN install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

RUN rm kubectl

# Install Helm
RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install Trivy
RUN wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor -o /usr/share/keyrings/trivy.gpg

RUN echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" > /etc/apt/sources.list.d/trivy.list

RUN apt-get update

RUN apt-get install -y trivy

# Install Sonar Scanner
RUN wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-7.1.0.4889-linux-x64.zip

RUN unzip sonar-scanner-cli-7.1.0.4889-linux-x64.zip -d /opt

RUN ln -s /opt/sonar-scanner-7.1.0.4889-linux-x64/bin/sonar-scanner /usr/local/bin/sonar-scanner

RUN rm sonar-scanner-cli-7.1.0.4889-linux-x64.zip

# Verify installations
RUN node --version

RUN npm --version

RUN java -version

RUN git --version

RUN docker --version

RUN aws --version

RUN kubectl version --client

RUN helm version

RUN trivy --version

RUN sonar-scanner --version