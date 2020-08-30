# puts("hello world")

require 'xcodeproj'

#打开项目工程.xcodeproj
#'./proj.ios_mac/hello_world.xcodeproj'
project_path = ARGV[0];
project = Xcodeproj::Project.open(project_path)

# 查询有多少个target
project.targets.each do |target|
    # puts target.name
end


# 遍历配置
project.targets[0].build_configurations.each do |config|
    # puts config.name   # Debug / Release
    #获得build settings
    build_settings = config.build_settings
    #build_settings是一个哈希，里面是一个个配置
    build_settings.each do |key,value|
        # print key, " == ", value, "\n"
        # 可在这里进行设置证书等操作，常用的如下：
        # 比如修改bundle id ,测试
        # build_settings[key] = "com.test.demo"
        # 设置授权文件
        # build_settings["CODE_SIGN_ENTITLEMENTS"] = "xxx.entitlements"
        # 设置签名 iPhone Distribution / iPhone Developer
        # build_settings["CODE_SIGN_IDENTITY[sdk=iphoneos*]"] = "iPhone Distribution"
        # ..... 其他的视情况(需求)去查找API
    end

    build_settings["FRAMEWORK_SEARCH_PATHS"] = ["$(inherited)", "$(PROJECT_DIR)/ios"]
    build_settings["DEVELOPMENT_TEAM"] = "XXXXXXXXXX"
end

# 找到需要操作的target
targetIndex = 0
project.targets.each_with_index do |target,index|
    if target.name == ""
        targetIndex = index
    end
end

# target
target = project.targets[targetIndex]

# 通过xcodeproj在工程的xxx group下引入xx.h和xx.m文件
#找到要插入的group (参数中true表示如果找不到group，就创建一个group)
group = project.main_group.find_subpath(File.join('ios'),true)

# #set一下sorce_tree
group.set_source_tree('SOURCE_ROOT')

# 获取全部的文件引用
file_ref_list = target.source_build_phase.files_references

# 设置文件引用是否存在标识
file_ref_mark = false

# 检测需要添加的文件是否存在
for file_ref_temp in file_ref_list
    # puts file_ref_temp.path.to_s
    if file_ref_temp.path.to_s.end_with?('api.mm') then
        file_ref_mark = true
    end
end

if !file_ref_mark then
    puts 'first add'

    # #向group中增加文件引用（.h文件只需引用一下，.m引用后还需add一下）
    file_ref = group.new_reference('./ios/api.h')

    file_ref = group.new_reference('./ios/api.mm')
    target.add_file_references([file_ref])

    #通过xcodeproj在工程中引入framwork、.a文件和bundle文件

    #添加xx.framework的引用
    file_ref = project.frameworks_group.new_file('./ios/NativePlugin.framework')
    target.frameworks_build_phases.add_file_reference(file_ref)
else
    puts 'already added'

end

# 最后保存文件
project.save