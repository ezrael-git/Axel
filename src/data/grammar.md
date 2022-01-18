def : def IDENT EQ EXPR


fn : fn IDENT LPAREN *args RPAREN 
     EXPR
     END


cls : cls IDENT 
      EXPR
      END



for : for IDENT IDENT 
      EXPR
      END



while : while CONDITION
        EXPR
        END




return : return EXPR
