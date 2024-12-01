import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/lib/models/Transaction";
import { connectToDB } from "@/lib/connectToDB";

// GET all transactions
export async function GET() {
    try {
        await connectToDB();
        const transactions = await Transaction.find({});
        console.log("transactions", transactions);
        return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}

// POST new transaction
export async function POST(request: NextRequest) {
    try {
        await connectToDB();
        const body = await request.json();
        console.log("body", body);
        const transaction = await Transaction.create(body);
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create transaction" },
            { status: 500 }
        );
    }
}

// PUT update transaction
export async function PUT(request: NextRequest) {
    try {
        await connectToDB();
        const { id, ...updateData } = await request.json();
        const transaction = await Transaction.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        console.log("to be updated", transaction);
        
        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update transaction" },
            { status: 500 }
        );
    }
}

// DELETE transaction
export async function DELETE(request: NextRequest) {
    try {
        await connectToDB();
        const { id } = await request.json();
        const transaction = await Transaction.findByIdAndDelete(id);
        
        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { message: "Transaction deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete transaction" },
            { status: 500 }
        );
    }
}