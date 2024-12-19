all: clean install

start:
	react-native start --port=8083

run:
	react-native run-android --port=8083

clean:
	rm -rf node_modules
	rm -rf android/.gradle
	rm -rf android/app/build

install:
	npm install
	patch node_modules/@react-native-mapbox-gl/maps/android/rctmgl/src/main/java/com/mapbox/rctmgl/components/camera/RCTMGLCamera.java < patches/patch-1.patch
	patch node_modules/@react-native-mapbox-gl/maps/android/rctmgl/src/main/java/com/mapbox/rctmgl/components/camera/RCTMGLCameraManager.java < patches/patch-2.patch
	patch node_modules/react-native-render-html/src/HTMLRenderers.js < patches/patch-3.patch

upgrade:
	ncu -u
	npm install
	npm audit fix

apk: clean install
	npx jetify
	cd android && ./gradlew assembleRelease
	ls -lh ./android/app/build/outputs/apk/release/app-release.apk

bundle: bundle-warn clean install
	npx jetify
	cd android && ./gradlew bundleRelease
	ls -lh ./android/app/build/outputs/bundle/release/app.aab

bundle-warn:
	@echo !!
	@echo !! Do not forget to bump versions in android/app/build.gradle before deployment.
	@echo !!

run-release:
	react-native run-android --variant=release
