ver=$(git describe --tags)

echo "打包模板，版本号: ${ver}"

# if [ "$(echo "${ver}" | egrep "^v\d+\.\d+\.\d+\.\d+$")" == "" ]; then
#   echo "版本号不符合规范（格式为 v1.2.3.4），或者相对于上一个tag有修改过，请重新打版本"
#   exit 1
# fi

mkdir ${ver}
cp -r Assets resource Scripts Temp ProjectSetting TypeScripts Editor tsconfig.json info.json *.html ${ver}
sed -e "s/{{template-version}}/${ver}/" ./StartScene.html > "${ver}/StartScene.html"
sed -e "s/{{template-version}}/${ver}/" ./PreviewGameWebGL.html > "${ver}/PreviewGameWebGL.html"
zip -rq "${ver}.zip" ${ver} -x \*.md -x \*.bat -x \*.sh -x \*.DS_Store -x ${ver}/Scripts/libs/three/\* -x \*.map -x \*.d.ts -x \*.meta
rm -rf ${ver}

echo "模板打包完成，请将 ${ver}.zip 上传更新模板"
