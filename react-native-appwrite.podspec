require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.authors      = 'Appwrite Team'
  s.platforms    = { :ios => '15.1' }
  s.source       = { :git => 'https://github.com/appwrite/sdk-for-react-native', :tag => s.version.to_s }
  s.source_files = 'ios/**/*.{h,m,mm}'

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
  end
end
