import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';

describe('Interface :: Campaigns :: Presentation :: RoutesDescription', () => {
    context('When desc object has all route descriptions', () => {
        it('should has the correct length', () => {
            const descLength = Object.keys(desc).length;
            expect(descLength).to.be.equal(12);
        });
    });
});
