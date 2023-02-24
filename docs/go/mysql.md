---
title: go中的mysql
description: 文章描述
aside: false
date: 2022-12-27
tags:
	- go
---

# mysql
[下载地址](https://dev.mysql.com/downloads/windows/installer/8.0.html)

## 创建一个表

```sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
  `accout` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `createTime` datetime(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
```


## 使用go链接数据库

需要依赖一个库[mysql](https://pkg.go.dev/github.com/go-sql-driver/mysql#section-readme)


```go
func linkDb() {
	var dsn = "root:mmbb1234@tcp(127.0.0.1:3306)/go_db?charset=utf8mb4&parseTime=true"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}
	// 设置最大的连接时长
	db.SetConnMaxLifetime(time.Minute * 3)
	// 最大的连接数
	db.SetMaxOpenConns(10)
	// 空闲的连接数
	db.SetMaxIdleConns(10)
	fmt.Printf("%v", db)

}
```
