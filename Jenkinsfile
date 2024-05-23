pipeline {

    environment {
        registry = "f-ksolutions-admin"
        acPort = 1337
        dockerImage = ''
        }

    agent {
    node {
     label 'k-solutions-admin-com'
     }
    }

    stages {
            stage('Delete old container') {
                        steps {
                            script {
                             try {
                           sh("java --version")
                           sh("docker stop f-ksolutions-admin")
                           sh("docker rm f-ksolutions-admin")
                           sh("docker rmi f-ksolutions-admin")
                                        } catch (err) {
                                            echo err.getMessage()
                                        }
                            }
                         }
                    }
            stage('Build docker image') {
                 steps {
                     script {
                        echo "current build number: ${currentBuild.number}"
                        sh("docker build -t  f-ksolutions-admin .")
                     }
                  }
             }
            stage('Run docker container') {
                 steps {
                     script {
                         sh(" docker run -td --restart unless-stopped -v /opt/certs/:/opt/certs  --name f-ksolutions-admin -p 80:80 -p 443:443 f-ksolutions-admin ")
                     }
                  }
             }
        }
}
