import desc from 'src/interface/users/presentation/users/RoutesDescription';

describe('Interface :: Users :: Presentation :: Users :: RoutesDescription', () => {
    context('When desc object has all route descriptions', () => {
        it('should has the correct length', () => {
            const descLength = Object.keys(desc).length;
            expect(descLength).to.be.equal(21);
        });
    });
});
