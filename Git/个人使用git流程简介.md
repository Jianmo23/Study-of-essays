- 标签： `Git`
- 时间： `2018-04-05`
- 更新： `2018-04-13`

## `git` 工作流程

![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git_flow.jpg)

## 个人使用流程简介

1. 切换至项目 `master` 分支， 执行 `git pull --rebase origin master` 操作，更新本地主分支代码；

2. 依据 `master` 分支执行 

   * `git checkout -b branchName` 或 `git checkout -b branchName origin/remoteBranch` 

   命令来创建个人分支，以后某一功能的开发和测试就在该分支进行；

3. 每一次修改后执行 `git status`, `git diff` 查看被修改的文件， 然后执行 `git add .` 添加修改文件至索引区，最后执行 

   * `git commit -m ''` 或 `git commit -a -m ''` 

   提交本次修改至本地仓库；

4. 以后每一次修改结束都会重复执行 `步骤3`；

5. 当本次要修改的功能代码开发结束，需要部署至测试环境进行测试，我会执行以后操作：

   - `git pull --rebase origin master` 更新主分支代码至本地分支，此时本地的提交记录是靠前的；

   - `git push origin branchName` 提交至远程仓库，这时远程会有一个同名的分支和本地保持一致；
 
6. 在测试环境测试过程中发现 bug 会不断的修改本地分支代码，最后提交本次修改（步骤3），更新主分支代码并提交本地分支至远程仓库（步骤5）；

7. 当测试工作结束后，会发现本地分支上存在很多的 `commit` 提交记录，此时执行 `git rebase -i` 将多个提交记录合并成一个, 然后执行 

  * `git push origin branchName -f` 

  强制更新远程仓库下同名分支；

8. 通过命令 `git show commit` 或 图形化工具 或 查看远程仓库 核查修改内容，这一步是为了防止有误操作；

9. 最后 `git checkout master` 切换至主分支，`git pull --rebase origin master` 更新主分支代码，

   `git rebase branchName` 或 `git cherry-pick commit` 合并修改至主分支， 最后 `git push origin master` 更新远程仓库；

10. 至此特定功能开发完毕，下面具体解释每一步操作。
 
## 详解

### 代码更新

* `git pull origin master`

* `git pull --rebase origin master`

**链接：** [`merge` 与 `rebase` 的区别](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/聊聊rebase与merge的区别.md)

### 创建新分支

* `git branch branchName`, `git checkout branchName`

* `git checkout -b branchName` (推荐)

### 提交当前修改

- `git add .` 或 `git add file1 file2 ...`, `git commit -m ''`

- `git commit -a -m ''` (**注：** 参数 -a 不能添加新建文件至缓存区)

- `git push origin branchName` 或 `git push origin HEAD:branchName`

依据 `git push origin HEAD:branchName` 方式可以想到删除远程分支的办法 `git push origin :remoteBranchName`

![GitHub set up-w200](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git_delete_remote_branch.jpg)

### 合并多个提交

1. `git rebase -i HEAD~n` (n: 代表合并commit记录的数量) 

2. `git rebase -i branchName` (branchName 表示基础分支，即创建当前分支的那个分支，例：依据 master 分支创建 ceshi 分支，这时的 branchName 就是 master)

**备注：`-i` 表示交互模式，也就是说可以干预 `rebase` 过程** 

**两种方法比较：**

* `方法1` 比 `方法2` 灵活。因为 `方法2` 是把 当前分支 相比 基础分支 的所有新提交记录执行 `-i` 操作；而 `方法1` 可以选择合并的提交记录数目；

```
工作原理：

rebase需要基于一个分支来设置你当前分支的基线，这基线就是当前分支的开始时间轴向后移动到最新的跟踪分支的最后面，这样你的当前分支就是最新的跟踪分支。

这里的操作是基于文件事务处理的，所以你不用怕中间失败会影响文件的一致性。在中间的过程中你可以随时取消 rebase 事务。git rebase –abort
```

![GitHub set up-w200](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git_rebase-i.jpg)


