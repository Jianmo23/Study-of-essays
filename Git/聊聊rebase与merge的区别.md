- 标签： `Git`
- 时间： `2018-04-06`
- 更新： ``

## `git` 工作流程

![GitHub set up](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git_flow.jpg)

从图中可以看出 `git pull` 相当于执行了两部操作 `git fetch` 与 `git merge`

以更新 `master` 分支为例：

```
法一：

git pull origin master master 或 git pull origin master

------------------------------------

法二：

git fetch origin master master 或 git fetch origin master

git merge master master 或 git merge master
```

## 原理解析

```
基于远程分支 master 创建 mywork 分支：

git checkout -b mywork origin/master
```

此时假设 master 分支已经有两个提交，如图：

![GitHub set up-w200](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git-diff_merge_rebase.jpg)

```
此时我们在 mywork 分支上做两次修改提交：

vi file1.txt

git add .

git commit -m 'modify file1'

----------------------------

vi file2.txt

git add .

git commit -m 'modify file2'
```

不过这时候有人在远程分支 master 提交了修改，这时候两个分支都意味着各自向前进了，彼此之间“分叉”了。如图：

![GitHub set up-w300](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git-diff_merge_rebase2.jpg)

这时 mywork 可以更新远程分支 mater 记录，将两个分支合并，这样看起来就像一个新的合并提交：

```
git merge origin/master 或 git pull origin master (默认使用 merge)
```

![GitHub set up-w300](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git-diff_merge_rebase3.jpg)

但是如果想让当前 mywork 分支历史看起来很干净，好像没经过合并一样，可以执行 `git merge`:

```
git checkout mywork

git rebase origin/master 或 git pull --rebase origin master
```

这些命令会把 mywork 分支里的每个提交（commit）取消掉，并把他们临时保存为补丁（patch）(会被存放在".git/rebase"目录中)，然后把 mywork 分支更新为最新的 master 分支，最后把保存的补丁应用到 mywork 分支上。

![GitHub set up-w300](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git-diff_merge_rebase4.jpg)

当 mywork 分支更新之后，它会指向这些新创建的提交(commit),而那些老的提交会被丢弃。 如果运行垃圾收集命令(pruning garbage collection), 这些被丢弃的提交就会删除. （请查看 git gc)

![GitHub set up-w300](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git-diff_merge_rebase5.jpg)

在 rebase 的过程中，经常会产生冲突（conflict），此时 Git 会停止 rebase 并提醒你解决冲突，在解决完冲突后执行 `git add .` 命令更新到暂存区，不需要执行 `git commit -m ''` 操作，仅需 `git rebase --continue`，这样 Git 会继续应用余下的补丁，从而完成 rebase 过程。
你也可以手动干预 rebase 过程，例如使用 `git rebase --abort` 命令终止此次 rebase，这样 mywork 分支就会恢复到 rebase 之前的状态。

## `git merge` 与 `git rebase` 区别

![GitHub set up-w300](https://github.com/ZYY1923/Study-of-essays/blob/git/Git/imgs/git-diff_merge_rebase6.jpg)

## `git merge` 与 `git rebase`相同点

* 两者都是用来合并两个分支的，例： `git merge b`, `git merge b` 两者都是把分支 b 合并到当前分支


## 引用

* [git rebase vs git merge详解](https://www.cnblogs.com/kidsitcn/p/5339382.html)






















