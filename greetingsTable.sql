drop table if exists greetings;

create table greetings(
	id serial not null primary key,
	name text not null unique,
    counter int not null default 0
);



