create table
    students (
        id bigserial primary key not null,
        full_name varchar(255) not null,
        course_number int not null,
        faculty varchar(255) not null
    )
create table
    books (
        id bigserial primary key not null,
        book_name varchar(255) not null,
        author varchar(255) not null
    )
create table
    rent (
        id bigserial primary key not null,
        book_id int not null references books(id),
        student_id int not null references students(id),
        rent_date date not null,
        deadline int not null,
        unique (book_id)
    )