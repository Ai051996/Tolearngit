This is a simple project to save hello world in git.
commands learnt:

bash commands realted:
1. mkdir -p paent/child1/child2
2. rm -rf (remove with all its contents)

Git related:
1. Git init
2. Git add . (all files)
3. Git commit -m ""
4. Git remote add origin URL  
   - here origin is the default name given to a remote repo
5. Git push -u origin main
    - here -u is upstream , local tracking the remote origin/main 
6. Git branch branchname
7. Git switch main/branch
8. Git pull --ff-only 
   - to pull only when the local is behind the remote contents, local should not have latest 
     contents different from main.
9. Git fetch and Git pull difference
  - fetch does just download and dose not merge, can be merged after doing git diff or git log, 
    basically see the differnce and then merge, safer side.
  - pull will download and merge immediatly

Git concept:
    - main is like pointer points the repofolder


