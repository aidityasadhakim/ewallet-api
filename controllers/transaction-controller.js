import mongoose from "mongoose";
import Transaction from "../models/transaction-model.js";
import User from "../models/users-model.js";
import jwtDecode from "jwt-decode";

// Deposit functionality
const deposit = async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const amount = req.body.amount;
  const depositTransaction = await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        balance: amount,
      },
    },
    { new: true }
  );

  if (!depositTransaction) {
    return res.status(401).json({ message: "Deposit Failed" });
  }

  const transactionDetails = new Transaction({
    user: depositTransaction._id,
    amount: amount,
    type: "deposit",
  });

  const transaction = await transactionDetails.save();

  if (!transaction) {
    return res.status(401).json({ message: "Deposit Failed" });
  }

  return res
    .status(200)
    .json({ message: "Deposit Successful", details: transaction });
};

// Withdrawal functionality
const withdrawal = async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  const amount = req.body.amount;

  if (!(user.balance > amount)) {
    return res.status(401).json({ message: "Insufficient funds" });
  }

  const withdrawalTransaction = await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        balance: -amount,
      },
    },
    { new: true }
  );

  if (!withdrawalTransaction) {
    return res.status(401).json({ message: "Withdrawal Failed" });
  }

  const transactionDetails = new Transaction({
    user: withdrawalTransaction._id,
    amount: amount,
    type: "withdrawal",
  });
  const transaction = await transactionDetails.save();

  if (!transaction) {
    return res.status(401).json({ message: "Withdrawal Failed" });
  }

  return res
    .status(200)
    .json({ message: "Withdrawal Successful", details: transaction });
};

// Transfer functionality
const transfer = async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).id;
  const user = await User.findById(userId);
  const amount = req.body.amount;

  const destinationAccount = await User.findById(req.body.destinationAccount);

  if (!user || !destinationAccount) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.balance < amount) {
    return res.status(401).json({ message: "Insufficient funds" });
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  const opts = { session, new: true };

  try {
    const transferTransaction = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          balance: -amount,
        },
      },
      opts
    );

    if (transferTransaction) {
      try {
        const depositDestinationAccount = await User.findByIdAndUpdate(
          destinationAccount._id,
          {
            $inc: {
              balance: amount,
            },
          },
          opts
        );

        if (depositDestinationAccount) {
          try {
            const transactionDetails = new Transaction({
              user: transferTransaction._id,
              amount: amount,
              type: "transfer",
              destinationAccount: destinationAccount._id,
            });

            const transaction = await transactionDetails.save({
              session: session,
            });

            if (transaction) {
              await session.commitTransaction();
              session.endSession();
              return res
                .status(200)
                .json({ message: "Transfer Complete", details: transaction });
            }
          } catch (error) {
            throw new Error(error.message);
          }
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(401).json({ message: "Transfer Failed", error: error });
  }
};

export { deposit, withdrawal, transfer };
