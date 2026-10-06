// Autolinking: the native modules Push uses, found on iOS through the package's podspec.
module.exports = {
    dependency: {
        platforms: {
            android: {
                packageImportPath:
                    'import io.appwrite.reactnative.AppwritePushPackage;',
                packageInstance: 'new AppwritePushPackage()',
            },
        },
    },
};
