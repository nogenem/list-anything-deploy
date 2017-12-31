#!/bin/bash

clear

### Checa diretorios e arquivos
if [ ! -d "../list-anything-react" ]; then
  echo "Directory: \"../list-anything-react\", not found!"
  exit
fi
if [ ! -d "../list-anything-api" ]; then
  echo "Directory: \"../list-anything-api\", not found!"
  exit
fi
if [ ! -f .env ]; then
  echo "File: \".env\", not found!"
  exit
fi

### Copia nova build do client
echo "Deseja copiar nova build do client? (s/n)"
read option
if [ "$option" = "s" ] 
then
  echo -e "\nLimpando dados antigos..."
  rm -r ./build-client
  echo -e "\nCopiando nova build do client..."
  cd ../list-anything-react
  yarn build
  cp -r ./build ../list-anything-deploy/build-client
  rm -r ./build
  
  cd ../list-anything-deploy
else
  echo "Ignorando build do client..."
fi

### Copia nova build do server
echo -e "\n\nDeseja copiar nova build do server? (s/n)"
read option
if [ "$option" = "s" ] 
then
  echo -e "\nLimpando dados antigos..."
  rm -r src
  rm package.json yarn.lock
  echo -e "\nCopiando nova build do server..."
  cd ../list-anything-api
  yarn build:deploy
  cp -r ./build ../list-anything-deploy/src
  cp package.json yarn.lock ../list-anything-deploy
  rm -r build
  
  cd ../list-anything-deploy
else
  echo "Ignorando build do server..."
fi

echo -e "\n\nEscolha uma das opcoes de deploy agora: \n"
echo -e "   [now; now alias],\n"
echo -e "   [openode deploy] ou\n"
echo -e "   [git add .; git commit -m \"msg...\"; git push heroku master]"

echo -e "\n\nEsperando comando para terminar..."
read option
