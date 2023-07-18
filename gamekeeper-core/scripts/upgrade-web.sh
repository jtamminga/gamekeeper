rm ../gamekeeper-web/gamekeeper-core*.tgz
mv gamekeeper-core*.tgz ../gamekeeper-web
cd ../gamekeeper-web
yarn add ./gamekeeper-core*.tgz
