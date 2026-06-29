import Demand from '../models/Demand.js';

export const getDemands = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const demands = await Demand.find(query).sort({ createdAt: -1 });
    res.json({ demands });
  } catch (error) {
    console.error('Get demands error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getDemand = async (req, res) => {
  try {
    const demand = await Demand.findById(req.params.id);
    if (!demand) {
      return res.status(404).json({ error: 'Demand not found' });
    }
    res.json({ demand });
  } catch (error) {
    console.error('Get demand error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createDemand = async (req, res) => {
  try {
    const { cropId, targetQuantity, pricePerQuintal, bonusPerQuintal, deadline, buyerId } = req.body;

    const now = new Date().toISOString();

    const demand = new Demand({
      cropId,
      targetQuantity,
      filledQuantity: 0,
      pricePerQuintal,
      bonusPerQuintal: bonusPerQuintal || 0,
      deadline,
      status: 'open',
      buyerId,
      members: [],
      contributors: 0,
      createdAt: now,
    });

    await demand.save();
    res.status(201).json({ id: demand._id.toString(), ...demand.toObject() });
  } catch (error) {
    console.error('Create demand error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const joinDemand = async (req, res) => {
  try {
    const { demandId } = req.params;
    const { farmerId, quantity } = req.body;

    const demand = await Demand.findById(demandId);
    if (!demand) {
      return res.status(404).json({ error: 'Demand not found' });
    }

    if (demand.status !== 'open') {
      return res.status(400).json({ error: 'Demand is not open for joining' });
    }

    const newMember = {
      farmerId,
      quantity: Number(quantity),
      joinedAt: new Date().toISOString(),
    };

    demand.members.push(newMember);
    demand.filledQuantity = (demand.filledQuantity || 0) + Number(quantity);
    demand.contributors = (demand.contributors || 0) + 1;

    // Check if demand is now filled
    if (demand.filledQuantity >= demand.targetQuantity) {
      demand.status = 'filled';
    }

    await demand.save();
    res.json({ demand });
  } catch (error) {
    console.error('Join demand error:', error);
    res.status(500).json({ error: error.message });
  }
};