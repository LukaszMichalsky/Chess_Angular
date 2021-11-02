export interface Piece{
    type: PieceType;
    color: Color;
    row: number;
    column: number;
}

enum Color
{
    Black,
    White
}

enum PieceType{
    King,
    Queen,
    Rook,
    Knight,
    Bishop,
    Pawn
}