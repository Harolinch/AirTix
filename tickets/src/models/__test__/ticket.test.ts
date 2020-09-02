import { Ticket } from '../ticket';

it('implements OOC', async (done) => {
    const ticket = Ticket.build({
        title: "test title",
        price: 20,
        userId: "1234",
    });
    await ticket.save();
    const tick1 = await Ticket.findById(ticket.id);
    const tick2 = await Ticket.findById(ticket.id);

    tick1!.set({price: 34});
    tick2!.set({price: 94});

    await tick1!.save(); //should be save successfully
    try{
        await tick2!.save(); //should through error becase version changed in last update
    }catch(err){
        return done();
    }
    throw new Error('test failed, shouldnt reach this point');
}) 