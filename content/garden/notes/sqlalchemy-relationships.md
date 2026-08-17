---
title: SQLAlchemy Relationship Strategies
tags: 
    - python
    - sqlalchemy 
    - orm
---


## N+1 Query Problem

When we have a 1-to-many relationship, like `Parent -> Child`, oftentimes we want to make a query to fetch all the children from all the parents.

For this, we can write something like this, naively.

```SQL
select * from Parent;
```

Then for each parent row, emit a second select stmt

```sql
select * from Child where Child.ParentId = <parent_id>
```

This basically emits N select queries for N parents, +1 select query for fetching all the parents.

Sometimes this is doing extra work.
A better option would be to write a single select stmt getting all the children instead

```sql
select * from Child
```

And if we need to get the parent info as well, we can use join statements

```sql
select * from Child
inner join Parent
on Child.ParentId = Parent.Id
```

## Relationship loading techniques

relationships are sqlalchemy primitives to represent related tables in ORM.

Here are all the info about them:

### Lazy Loading (Default)

This is the default behaviour, achieved by adding the field

```python
relationship(Child, lazy="select")
```

or, during query, provide it as a select option:

```python
select(Parent).options(lazyload(Parent.children))
```

This enables lazy loading of the fields, which means unless the relationship field is accessed (`__getattr__`), it won't be loaded in the session (memory).
When it is enabled, any explicit access to the relationship field will emit a second select statement.
However, if you are using `AsyncSession`, the access would cause a greenlet spawn error, because [[sqlalchemy-implicit-io|Implicit IO in AsyncSession]]

### Select IN Loading

Either

```python
relationship(Child, lazy="selectin")
```

or

```python
select(Parent).options(selectinload(Parent.children))
```

Here we are eager-loading.
This explicitly tells SQLALchemy to always load the relationship when fetching the parent rows in memory.
This solves the N+1 query because the second SELECT also happens alongside the first SELECT for the parent, instead of lazily evaluating at the time of the parent trying to access its children attributes. So we end up making only one round-trip to the db with its SELECT operations.

### Joined Loading

Either

```python
relationship(Child, lazy="joined")
```

or

```python
select(Parent).options(joinedload(Parent.children))
```

Similar to select In load, this is a variant of eager-loading.
Instead of emitting a second SELECT query at the start, we make a single SELECT query with JOIN statements.
This is usually more performative because we are are avoiding the N+1 query here, by making just one round trip to the db.
The downside of this is the potentially bigger size of the transaction and having the joined data of two tables.

Another issue is that when using joins, we will have duplicates from the left-table (because of repetitions), which needs to be resolved at the ORM level.
Hence, after the select(), we need to run a `unique()` on the result sets to get the unique rows.

### Raise Loading

Either `lazy="raise", lazy="raise_on_sql"` or `raiseload()`
This is similar to lazy loads, but at the time of lazy loading (implicit IO on attribute access), an error will be raised.
This is to prevent implicit IO at any cost, at all times.

This is useful if you only want to enable eager-loading for one relationship and block if for the rest.

```python
select(Parent).options(joinedload(Parent.children), raisedload("*"))
```

This raises on lazyload for any attribute other than Parent.children, but also for any attribute in `Child` which might also be lazyloaded.
To only make raised load work for Parent we have to specify it using `Load`

```python
from sqlalchemy.orm import Load

select(Parent).options(joinedload(Parent.children), Load(Parent).raisedload("*"))
```

### Write-Only Loading

Use `lazy="write_only"`
Or use Annotations

```python
class Account(Base):
...     __tablename__ = "account"
...     id: Mapped[int] = mapped_column(primary_key=True)
...     identifier: Mapped[str]
...
...     account_transactions: WriteOnlyMapped["AccountTransaction"] = relationship(
...         cascade="all, delete-orphan",
...         passive_deletes=True,
...         order_by="AccountTransaction.timestamp",
...     )
...
...     def __repr__(self):
...         return f"Account(identifier={self.identifier!r})"
```

The collection will only be used for writes, it cannot be used for read, i.e implicit IO access would throw an error. If you want to read from the collection you need to write an explicit select query to fetch the relationships.

## Difference between using joins and joinedloads

In sqlalchemy, there is the `.join()` construct that can be used to explicitly add JOIN statements to the query.
This is slightly different from the joinedloads, as in joinedloads the end result is to abstract away the mechanisms of how the parent-child relationships were loaded and just return the same resultset irrespective of whether you use joinedload, selectinload or lazyload. Whereas, you use joins when you want to alter the results of a query.

>The philosophy behind loader strategies is that any set of loading schemes can be applied to a particular query, and the results don’t change - only the number of SQL statements required to fully load related objects and collections changes.

Basically, if you have an ORM class `Users` with a relationship `addresses`,
using a `joinedload(Users.addresses)` will make sure that the resulting user objects contain their respective addresses.
Whereas, if you use `.join()`, then it is free-real estate for us, and we would like to use the joined table columns at some later-stage queries

Example 1:

```python
select(Users)
 .join(Users.addresses)
 .filter(Users.name == "abc")
 .order_by(Address.email_address)
```

Here, the join statement emits a JOIN clause with `Users` table and `Address` table ON `Users.id == Address.user_id`, in this composite merged tables, we apply further queries and filters such as `order_by(Address.email_address)` which emits `ORDER BY address.email_address`

Example 2:

```python
select(Users)
 .options(joinedload(Users.addresses))
 .filter(Users.name == "abc")
 .order_by(Address.email_address)
```
