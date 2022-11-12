rm ../gamekeeper-cli/gamekeeper-core*.tgz
mv gamekeeper-core*.tgz ../gamekeeper-cli
cd ../gamekeeper-cli
yarn add ./gamekeeper-core*.tgz
