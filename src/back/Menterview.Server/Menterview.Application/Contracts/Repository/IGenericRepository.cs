namespace Menterview.Application.Contracts.Repository;

public interface IGenericRepository<TEntity, in TKey> where TEntity : class
{
    Task<IReadOnlyCollection<TEntity>>  GetAllAsync();
    Task<TEntity> GetByIdAsync(TKey id);
    Task AddAsync(TEntity entity);
    Task UpdateAsync(TEntity entity);
    Task DeleteAsync(TEntity entity);
}