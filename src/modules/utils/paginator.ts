export default class Paginator {
  private itemsPerPage: number;
  private page: number;
  public skip: number;
  public take: number;

  constructor(itemsPerPage: number = 10, page: number = 1) {
    this.itemsPerPage = +itemsPerPage;
    this.page = +page < 1 ? 1 : +page;

    this.skip = this.itemsPerPage * (this.page - 1);
    this.take = this.itemsPerPage;
  }

  getInfos(total: number) {
    return {
      hasPreviousPage: this.hasPreviousPage(),
      hasNextPage: this.hasNextPage(total),
      itemsPerPage: this.itemsPerPage,
      page: this.page,
      total,
    };
  }

  private hasPreviousPage() {
    return this.page !== 1;
  }

  private hasNextPage(total: number) {
    return this.itemsPerPage * this.page < total;
  }
}
