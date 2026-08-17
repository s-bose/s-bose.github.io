---
title: Implicit IO in SQLAlchemy
tags: 
    - python
    - sqlalchemy 
    - orm
---

## Lazy Loading

Lazy loading refers to the concept of not having the entire data in memory from the database (or some other source) but knowing the means of getting it at a later stage if it is needed.
In the concept of ORM, if the object that's loaded into memory representing a row in DB, and the ORM definition has lazy loading enabled for certain attributes, those attributes won't be loaded at the first glance in the memory.

But when accessing those attributes in the ORM object by getattr, SQLalchemy will have to make a separate lazy select query to fetch those fields from the Db.

>When attributes that refer to database columns or related objects are accessed, for which no loaded value is present, the ORM makes use of the Session for which the current object is associated with in the persistent state, and emits a SELECT statement on the current transaction, starting a new transaction if one was not in progress.

Basically, once an ORM object is loaded into the memory (Session), if one of the attributes that are marked as lazy loaded is accessed but its value is not present in the current session, it emits a second SELECT statement to fetch that value(s).

Sqlalchemy async forbids the use of such cases. We need to avoid any chance of implicit IO from lazy loading on attribute access.

This is because (my best guess), the IOs (low-level calls to database drivers) are managed by the asyncio event pool now. Any type of implicit attribute access will result in running another transaction which would require running a new asyncio task in the current event loop.

I think I yapped a bit but honestly there aren't too much documentation.
Added a stackoverflow question for this as well.
<https://stackoverflow.com/questions/79127505/reason-for-avoiding-implicit-io-in-attribute-access-in-sqlalchemy-2-0-asyncio>
