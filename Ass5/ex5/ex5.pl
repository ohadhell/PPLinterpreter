:- module('ex5',
        [author/2,
         genre/2,
         book/4
        ]).

/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
maximum_printing_depth(100).
:- current_prolog_flag(toplevel_print_options, A),
   (select(max_depth(_), A, B), ! ; A = B),
   maximum_printing_depth(MPD),
   set_prolog_flag(toplevel_print_options, [max_depth(MPD)|B]).



author(1, "Isaac Asimov").
author(2, "Frank Herbert").
author(3, "William Morris").
author(4, "J.R.R Tolkein").


genre(1, "Science").
genre(2, "Literature").
genre(3, "Science Fiction").
genre(4, "Fantasy").

book("Inside The Atom", 1, 1, 500).
book("Asimov's Guide To Shakespeare", 1, 2, 400).
book("I, Robot", 1, 3, 450).
book("Dune", 2, 3, 550).
book("The Well at the World's End", 3, 4, 400).
book("The Hobbit", 4, 4, 250).
book("The Lord of the Rings", 4, 4, 1250).

% You can add more facts.
% Fill in the Purpose, Signature as requested in the instructions here


% Signature: authorOfGenre(GenreName, AuthorName)/2
% Purpose: get the books of Genre GenreName written by AuthorName.
authorOfGenre(GenreName, AuthorName) :-
    author(X,AuthorName), 
    genre(Y,GenreName),
    book(_S1,X,Y,_S2).


    
max(X,Y,X) :- X >= Y.           % m1
max(X,Y,Y) :- X < Y.            % m2
listMax([X],X).                 % l1
listMax([X,Y|Rest],Max) :-      % l2
   listMax([Y|Rest],MaxRest),
   max(X,MaxRest,Max).


% Signature: longestBook(AuthorId, BookName)/2
% Purpose: get the BookName of AuthorId such that BookName is the Longest written book by AuthorId
longestBook(AuthorId, BookName):-
        findall(Length,book(_,AuthorId,_,Length),Results),
        listMax(Results,Max),
    	book(BookName,AuthorId,_,Max).

dif(X,Y):- not(X=Y).
dif3(X,Y,Z):-
    dif(X,Y),
    dif(Y,Z),
    dif(X,Z).
checkDif([X,Y,Z|_]):-           %c1
    dif3(X,Y,Z).
checkDif([X,Y,_|Rest]):-        %c2
    checkDif([X,Y|Rest]).
checkDif([X,_,Z|Rest]):-        %c3
    checkDif([X,Z|Rest]).
checkDif([_,Y,Z|Rest]):-        %c4
    checkDif([Y,Z|Rest]).
        

% Signature: versatileAuthor(AuthorName)/1
% Purpose: check if author AuthorName has written books of at least 3 different genres
versatileAuthor(AuthorName):-
        author(AuthorId,AuthorName),
        findall(BooksGenres,book(_,AuthorId,BooksGenres,_), Results),
        checkDif(Results).


