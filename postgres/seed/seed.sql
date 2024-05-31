BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) VALUES ('john', 'jdoe@gmail.com', 4, '2024-03-17');
INSERT INTO login (hash, email) VALUES ('$2a$10$8mNXT7NSxDFRApMXatXab.fuSJlxoZfMDy57nd3JZvnZxLVwM9ZYK', 'jdoe@gmail.com');

COMMIT;