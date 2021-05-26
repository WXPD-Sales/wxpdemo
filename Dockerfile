FROM node:8.16.0-alpine

#sudo docker build -t wxsd-guest-demo .
#sudo docker run -p 10031:10031 -i -t wxsd-guest-demo

#aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 191518685251.dkr.ecr.us-west-1.amazonaws.com
#docker tag wxsd-guest-demo:latest 191518685251.dkr.ecr.us-west-1.amazonaws.com/wxsd-guest-demo:latest
#docker push 191518685251.dkr.ecr.us-west-1.amazonaws.com/wxsd-guest-demo:latest

#I think this only has to be done 1 time.
#aws eks --region us-west-1 update-kubeconfig --name bdm-cluster
#kubectl cluster-info

#kubectl apply -f wxsd-guest-demo.yaml
#kubectl get ingress -n wxsd-guest-demo

#kubectl get pods
#kubectl describe pod <pod name>

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

#overwrite default environment variables
COPY bdm.env .env

EXPOSE 10031

CMD [ "npm", "start" ]
