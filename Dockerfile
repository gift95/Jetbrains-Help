FROM maven:3-ibm-semeru-21-jammy AS build
WORKDIR /app

# 安装可能需要的额外工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# 先复制pom.xml尝试缓存依赖
COPY pom.xml .
# 使用更可靠的依赖下载方式
RUN mvn dependency:resolve-plugins dependency:resolve -e

# 复制所有项目文件
COPY . .

# 构建项目
RUN mvn clean package -DskipTests -e

FROM ibm-semeru-runtimes:open-21-jre
WORKDIR /app

# 复制构建产物
COPY --from=build /app/target/Jetbrains-Help.jar Jetbrains-Help.jar

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 暴露端口
EXPOSE 10768


# 启动应用
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "Jetbrains-Help.jar"]
    