export interface IPiece{
    type?: PieceType;
    color?: Color;
    row: number;
    column: number;
    validCell?: boolean;
}

export enum Color
{
    Black = "Black",
    White = "White"
}

export enum PieceType{
    King = 'King',
    Queen = 'Queen',
    Rook = 'Rook',
    Knight = 'Knight',
    Bishop = 'Bishop',
    Pawn = 'Pawn'
}
