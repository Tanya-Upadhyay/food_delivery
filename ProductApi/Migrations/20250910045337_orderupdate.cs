using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductApi.Migrations
{
    /// <inheritdoc />
    public partial class orderupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderOID",
                table: "OrderItem",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_OrderOID",
                table: "OrderItem",
                column: "OrderOID");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Order_OrderOID",
                table: "OrderItem",
                column: "OrderOID",
                principalTable: "Order",
                principalColumn: "OID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Order_OrderOID",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_OrderOID",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "OrderOID",
                table: "OrderItem");
        }
    }
}
