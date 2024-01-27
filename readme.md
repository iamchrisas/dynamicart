# LAB | DYNAMICART

## Summary

A lightweight app to showcase your art

- You can
  - create an account, login, logout
  - view, create, update, delete a post
  - view, create, update, delete tags
  - view the all of the posts of a user


 Entity-Relationship Diagram (ERD)

+---------+           +---------+           +---------+
|  User   |           |  Post   |           |  Tag    |
+---------+           +---------+           +---------+
| UserID  |1        * | PostID  |1        * | TagID   |
| Username|<----------| UserID  |           | Name    |
| Email   |           | Title   |<----------| PostID  |
| Password|           | Image   |           | ...     |
| ...     |           | ...     |           +---------+
+---------+           +---------+


### App by Chris

https://github.com/iamchrisas
