import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectToDB } from "@/lib/connectToDB";
import mongoose from "mongoose";

// GET all users
export async function GET() {
    try {
        await connectToDB();
        const users = await User.find({});
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

// POST new user
export async function POST(request: NextRequest) {
    try {
        await connectToDB();
        const body = await request.json();
        const user = await User.create(body);
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}

// PUT update user
export async function PUT(request: NextRequest) {
    try {
        await connectToDB();
        const { id, ...updateData } = await request.json();
        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

// DELETE user
export async function DELETE(request: NextRequest) {
    try {
        await connectToDB();
        const { id } = await request.json();
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}